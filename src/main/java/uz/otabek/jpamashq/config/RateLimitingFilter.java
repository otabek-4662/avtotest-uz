package uz.otabek.jpamashq.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

@Component
public class RateLimitingFilter extends OncePerRequestFilter {

    private static final long MAX_REQUESTS_PER_MINUTE = 60;
    private final ConcurrentHashMap<String, RequestInfo> requestCounts = new ConcurrentHashMap<>();

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // Only rate limit API requests
        if (request.getRequestURI().startsWith("/api/")) {
            String clientIp = request.getRemoteAddr();
            long currentTime = System.currentTimeMillis();

            requestCounts.compute(clientIp, (key, requestInfo) -> {
                if (requestInfo == null || currentTime - requestInfo.timestamp > TimeUnit.MINUTES.toMillis(1)) {
                    return new RequestInfo(1, currentTime);
                } else {
                    requestInfo.count++;
                    return requestInfo;
                }
            });

            RequestInfo info = requestCounts.get(clientIp);

            if (info.count > MAX_REQUESTS_PER_MINUTE) {
                response.setStatus(429); // Too Many Requests
                response.setContentType("application/json");
                response.getWriter().write("{\"success\":false,\"message\":\"Too many requests! Rate limit exceeded.\"}");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

    private static class RequestInfo {
        int count;
        long timestamp;

        RequestInfo(int count, long timestamp) {
            this.count = count;
            this.timestamp = timestamp;
        }
    }
}
