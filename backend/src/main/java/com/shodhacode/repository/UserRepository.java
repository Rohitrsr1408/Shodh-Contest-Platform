package com.shodhacode.repository;

import com.shodhacode.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsernameAndContestId(String username, Long contestId);
    List<User> findByContestId(Long contestId);
}
