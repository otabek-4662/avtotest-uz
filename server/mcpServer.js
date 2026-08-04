import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pool } from "./db.js";

export function createMcpServer() {
  const server = new McpServer({
    name: "AvtoTest-UZ-MCP",
    version: "1.0.0"
  });

  // 1-TOOL: get_users_count
  server.tool(
    "get_users_count",
    "PostgreSQL bazasidan foydalanuvchilarning umumiy sonini qaytaradi.",
    {},
    async () => {
      try {
        const result = await pool.query("SELECT COUNT(*) AS total_users FROM users;");
        const count = result.rows[0]?.total_users || 0;
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ success: true, total_users: parseInt(count, 10) }, null, 2)
            }
          ]
        };
      } catch (error) {
        console.error("Error in get_users_count:", error);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ success: false, error: error.message }, null, 2)
            }
          ],
          isError: true
        };
      }
    }
  );

  // 2-TOOL: get_test_stats
  server.tool(
    "get_test_stats",
    "Testlar bo'yicha eng ko'p xato qilingan savollar va umumiy test statistikalarini olib beradi.",
    {
      limit: z.number().optional().default(5).describe("Qaytariladigan eng ko'p xato qilingan savollar soni")
    },
    async ({ limit }) => {
      try {
        const wrongAnswersQuery = `
          SELECT 
            q.id AS question_id,
            q.title AS question_title,
            COUNT(ua.id) AS wrong_count
          FROM user_answers ua
          JOIN questions q ON q.id = ua.question_id
          WHERE ua.is_correct = false
          GROUP BY q.id, q.title
          ORDER BY wrong_count DESC
          LIMIT $1;
        `;

        const totalStatsQuery = `
          SELECT 
            COUNT(*) AS total_attempts,
            SUM(CASE WHEN is_correct THEN 1 ELSE 0 END) AS correct_attempts,
            SUM(CASE WHEN NOT is_correct THEN 1 ELSE 0 END) AS wrong_attempts
          FROM user_answers;
        `;

        const [wrongRes, statsRes] = await Promise.all([
          pool.query(wrongAnswersQuery, [limit]),
          pool.query(totalStatsQuery)
        ]);

        const responseData = {
          success: true,
          overall_stats: statsRes.rows[0],
          top_wrong_questions: wrongRes.rows
        };

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(responseData, null, 2)
            }
          ]
        };
      } catch (error) {
        console.error("Error in get_test_stats:", error);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ success: false, error: error.message }, null, 2)
            }
          ],
          isError: true
        };
      }
    }
  );

  // 3-TOOL: add_new_question
  server.tool(
    "add_new_question",
    "Yangi savol, uning variantlari va to'g'ri javobini bazaga saqlaydi.",
    {
      title: z.string().min(3).describe("Savol matni"),
      options: z.array(z.string()).min(2).describe("Javob variantlari massivi"),
      correct_option_index: z.number().min(0).describe("To'g'ri javobning indeksi (0-based)"),
      category_id: z.number().optional().describe("Savol kategoriyasi IDsi")
    },
    async ({ title, options, correct_option_index, category_id }) => {
      const client = await pool.connect();
      try {
        if (correct_option_index < 0 || correct_option_index >= options.length) {
          throw new Error("correct_option_index variantlar hajmidan tashqarida!");
        }

        await client.query('BEGIN');

        const insertQuestionQuery = `
          INSERT INTO questions (title, category_id, created_at)
          VALUES ($1, $2, NOW())
          RETURNING id;
        `;
        const qRes = await client.query(insertQuestionQuery, [title, category_id || null]);
        const questionId = qRes.rows[0].id;

        for (let i = 0; i < options.length; i++) {
          const isCorrect = i === correct_option_index;
          await client.query(
            `INSERT INTO question_options (question_id, option_text, is_correct) VALUES ($1, $2, $3);`,
            [questionId, options[i], isCorrect]
          );
        }

        await client.query('COMMIT');

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                message: "Yangi savol va variantlar muvaffaqiyatli saqlandi",
                question_id: questionId
              }, null, 2)
            }
          ]
        };
      } catch (error) {
        await client.query('ROLLBACK');
        console.error("Error in add_new_question:", error);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ success: false, error: error.message }, null, 2)
            }
          ],
          isError: true
        };
      } finally {
        client.release();
      }
    }
  );

  return server;
}
