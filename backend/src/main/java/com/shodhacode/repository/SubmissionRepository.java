package com.shodhacode.repository;

import com.shodhacode.entity.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    List<Submission> findByUserId(Long userId);
    List<Submission> findByProblemId(Long problemId);
    
    @Query("SELECT s FROM Submission s WHERE s.userId IN " +
           "(SELECT u.id FROM User u WHERE u.contestId = :contestId)")
    List<Submission> findByContestId(Long contestId);
}
