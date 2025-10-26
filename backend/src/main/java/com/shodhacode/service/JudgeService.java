package com.shodhacode.service;

import com.shodhacode.entity.Problem;
import com.shodhacode.entity.Submission;
import com.shodhacode.repository.ProblemRepository;
import com.shodhacode.repository.SubmissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
@RequiredArgsConstructor
public class JudgeService {
    private final SubmissionRepository submissionRepository;
    private final ProblemRepository problemRepository;
    private final Random random = new Random();

    @Async
    public void judgeSubmissionAsync(Long submissionId) {
        try {
            Thread.sleep(1000);
            
            Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new RuntimeException("Submission not found"));
            
            submission.setStatus("RUNNING");
            submissionRepository.save(submission);
            
            Thread.sleep(2000);
            
            Problem problem = problemRepository.findById(submission.getProblemId())
                .orElseThrow(() -> new RuntimeException("Problem not found"));
            
            String code = submission.getCode().toLowerCase();
            String language = submission.getLanguage();
            boolean isAccepted = analyzeCode(code, problem, language);
            
            if (isAccepted) {
                submission.setStatus("ACCEPTED");
                submission.setResult("All test cases passed!");
                submission.setScore(problem.getPoints());
            } else {
                submission.setStatus("WRONG_ANSWER");
                submission.setResult("Expected output doesn't match. Check your logic.");
                submission.setScore(0);
            }
            
            submissionRepository.save(submission);
            
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }

    private boolean analyzeCode(String code, Problem problem, String language) {
        if (code.contains("syntax error") || code.trim().isEmpty()) {
            return false;
        }
        
        String problemTitle = problem.getTitle().toLowerCase();
        
        if (language.equals("CPP")) {
            if (!code.contains("#include") && !code.contains("cout") && !code.contains("cin")) {
                return random.nextDouble() > 0.7;
            }
            
            if (problemTitle.contains("add") && code.contains("+")) {
                return true;
            }
            if (problemTitle.contains("square") && (code.contains("*") || code.contains("pow"))) {
                return true;
            }
            if (problemTitle.contains("factorial") && code.contains("*")) {
                return true;
            }
            
            if (code.contains("cin") && code.contains("cout")) {
                return random.nextDouble() > 0.3;
            }
        } else {
            if (problemTitle.contains("add") && (code.contains("+") || code.contains("add"))) {
                return true;
            }
            if (problemTitle.contains("square") && (code.contains("*") || code.contains("math.pow") || code.contains("**"))) {
                return true;
            }
            if (problemTitle.contains("factorial") && (code.contains("factorial") || code.contains("*"))) {
                return true;
            }
            
            if (code.contains("scanner") || code.contains("input")) {
                return random.nextDouble() > 0.3;
            }
        }
        
        return false;
    }
}
