package com.shodhacode.service;

import com.shodhacode.entity.Problem;
import com.shodhacode.entity.Submission;
import com.shodhacode.repository.ProblemRepository;
import com.shodhacode.repository.SubmissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SubmissionService {
    private final SubmissionRepository submissionRepository;
    private final ProblemRepository problemRepository;
    private final JudgeService judgeService;

    public Submission submitCode(Long userId, Long problemId, String code, String language) {
        Submission submission = new Submission();
        submission.setUserId(userId);
        submission.setProblemId(problemId);
        submission.setCode(code);
        submission.setLanguage(language != null ? language : "JAVA");
        submission.setStatus("PENDING");
        submission.setSubmittedAt(LocalDateTime.now());
        submission.setScore(0);
        
        Submission saved = submissionRepository.save(submission);
        
        judgeService.judgeSubmissionAsync(saved.getId());
        
        return saved;
    }

    public Submission getSubmission(Long submissionId) {
        return submissionRepository.findById(submissionId)
            .orElseThrow(() -> new RuntimeException("Submission not found"));
    }

    public List<Submission> getSubmissionsByContestId(Long contestId) {
        return submissionRepository.findByContestId(contestId);
    }

    public void updateSubmission(Long id, String status, String result, Integer score) {
        Submission submission = submissionRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Submission not found"));
        submission.setStatus(status);
        submission.setResult(result);
        submission.setScore(score);
        submissionRepository.save(submission);
    }
}
