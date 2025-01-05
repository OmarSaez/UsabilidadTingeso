package edu.mtisw.prestabank_backend.Repository;

import edu.mtisw.prestabank_backend.Entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {
    public UserEntity findByRut(String rut);
    public UserEntity findUserByEmail(String email);

}
