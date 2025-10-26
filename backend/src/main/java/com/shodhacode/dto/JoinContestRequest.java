package com.shodhacode.dto;

import lombok.Data;

@Data
public class JoinContestRequest {
    private String username;
    private Long contestId;
}
