package com.shodhacode.service;

import com.shodhacode.entity.Contest;
import com.shodhacode.entity.User;
import com.shodhacode.repository.ContestRepository;
import com.shodhacode.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ContestService {
    private final ContestRepository contestRepository;
    private final UserRepository userRepository;

    public Contest getContest(Long contestId) {
        return contestRepository.findById(contestId)
            .orElseThrow(() -> new RuntimeException("Contest not found"));
    }

    public User joinContest(String username, Long contestId) {
        if (!contestRepository.existsById(contestId)) {
            throw new RuntimeException("Contest not found");
        }

        return userRepository.findByUsernameAndContestId(username, contestId)
            .orElseGet(() -> {
                User newUser = new User();
                newUser.setUsername(username);
                newUser.setContestId(contestId);
                return userRepository.save(newUser);
            });
    }
}
