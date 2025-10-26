package com.shodhacode.controller;

import com.shodhacode.dto.SubmitCodeRequest;
import com.shodhacode.entity.Submission;
import com.shodhacode.service.SubmissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/submissions")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class SubmissionController {
    private final SubmissionService submissionService;

    @PostMapping
    public ResponseEntity<Submission> submitCode(@RequestBody SubmitCodeRequest request) {
        Submission submission = submissionService.submitCode(
            request.getUserId(),
            request.getProblemId(),
            request.getCode()
        );
        return ResponseEntity.ok(submission);
    }

    @GetMapping("/{submissionId}")
    public ResponseEntity<Submission> getSubmission(@PathVariable Long submissionId) {
        return ResponseEntity.ok(submissionService.getSubmission(submissionId));
    }
}
