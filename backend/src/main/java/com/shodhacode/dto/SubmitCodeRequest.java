package com.shodhacode.dto;

import lombok.Data;

@Data
public class SubmitCodeRequest {
    private Long userId;
    private Long problemId;
    private String code;
}
