package com.shodhacode.controller;

import com.shodhacode.dto.JoinContestRequest;
import com.shodhacode.dto.LeaderboardEntry;
import com.shodhacode.entity.Contest;
import com.shodhacode.entity.User;
import com.shodhacode.service.ContestService;
import com.shodhacode.service.LeaderboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contests")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ContestController {
    private final ContestService contestService;
    private final LeaderboardService leaderboardService;

    @GetMapping("/{contestId}")
    public ResponseEntity<Contest> getContest(@PathVariable Long contestId) {
        return ResponseEntity.ok(contestService.getContest(contestId));
    }

    @PostMapping("/join")
    public ResponseEntity<User> joinContest(@RequestBody JoinContestRequest request) {
        User user = contestService.joinContest(request.getUsername(), request.getContestId());
        return ResponseEntity.ok(user);
    }

    @GetMapping("/{contestId}/leaderboard")
    public ResponseEntity<List<LeaderboardEntry>> getLeaderboard(@PathVariable Long contestId) {
        return ResponseEntity.ok(leaderboardService.getLeaderboard(contestId));
    }
}
