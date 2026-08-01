package uz.otabek.jpamashq.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uz.otabek.jpamashq.entity.Promocode;

import java.util.Optional;

@Repository
public interface PromocodeRepository extends JpaRepository<Promocode, Long> {
    Optional<Promocode> findByCode(String code);
    boolean existsByCode(String code);
}
