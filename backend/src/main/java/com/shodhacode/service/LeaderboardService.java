package com.shodhacode.service;

import com.shodhacode.dto.LeaderboardEntry;
import com.shodhacode.entity.Submission;
import com.shodhacode.entity.User;
import com.shodhacode.repository.SubmissionRepository;
import com.shodhacode.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LeaderboardService {
    private final UserRepository userRepository;
    private final SubmissionRepository submissionRepository;

    public List<LeaderboardEntry> getLeaderboard(Long contestId) {
        List<User> users = userRepository.findByContestId(contestId);
        List<Submission> allSubmissions = submissionRepository.findByContestId(contestId);
        
        Map<Long, LeaderboardEntry> leaderboardMap = new HashMap<>();
        
        for (User user : users) {
            leaderboardMap.put(user.getId(), new LeaderboardEntry(user.getUsername(), 0, 0));
        }
        
        Map<String, Integer> userProblemBestScore = new HashMap<>();
        
        for (Submission submission : allSubmissions) {
            if ("ACCEPTED".equals(submission.getStatus())) {
                String key = submission.getUserId() + "-" + submission.getProblemId();
                Integer currentBest = userProblemBestScore.getOrDefault(key, 0);
                
                if (submission.getScore() > currentBest) {
                    userProblemBestScore.put(key, submission.getScore());
                }
            }
        }
        
        for (Map.Entry<String, Integer> entry : userProblemBestScore.entrySet()) {
            Long userId = Long.parseLong(entry.getKey().split("-")[0]);
            LeaderboardEntry leaderboardEntry = leaderboardMap.get(userId);
            
            if (leaderboardEntry != null) {
                leaderboardEntry.setTotalScore(leaderboardEntry.getTotalScore() + entry.getValue());
                leaderboardEntry.setSolvedProblems(leaderboardEntry.getSolvedProblems() + 1);
            }
        }
        
        return leaderboardMap.values().stream()
            .sorted(Comparator.comparing(LeaderboardEntry::getTotalScore).reversed()
                .thenComparing(LeaderboardEntry::getUsername))
            .collect(Collectors.toList());
    }
}
