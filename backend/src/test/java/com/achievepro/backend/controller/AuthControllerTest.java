package com.achievepro.backend.controller;

import com.achievepro.backend.model.User;
import com.achievepro.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.*;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.web.client.RestClient;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
class AuthControllerTest {

    @LocalServerPort
    int port;

    @Autowired
    UserRepository userRepository;

    RestClient client;

    @BeforeEach
    void setup() {
        userRepository.deleteAll();
        client = RestClient.builder().baseUrl("http://localhost:" + port).build();
    }

    // ─── Register ─────────────────────────────────────────────────────────────

    @Test
    void register_student_success() {
        var body = Map.of("name", "Alice", "email", "alice@test.com",
                "password", "pass123", "role", "student");

        ResponseEntity<User> resp = client.post().uri("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON).body(body)
                .retrieve().toEntity(User.class);

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(resp.getBody().getEmail()).isEqualTo("alice@test.com");
        assertThat(resp.getBody().getRole()).isEqualTo("student");
        assertThat(resp.getBody().getCourse()).isEqualTo("B.Tech Computer Science");
        assertThat(resp.getBody().getYear()).isEqualTo("1st Year");
        assertThat(resp.getBody().getId()).isNotBlank();
    }

    @Test
    void register_teacher_success() {
        var body = Map.of("name", "Prof. Bob", "email", "bob@test.com",
                "password", "pass123", "role", "teacher");

        ResponseEntity<User> resp = client.post().uri("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON).body(body)
                .retrieve().toEntity(User.class);

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(resp.getBody().getRole()).isEqualTo("teacher");
        assertThat(resp.getBody().getDepartment()).isEqualTo("Computer Science");
    }

    @Test
    void register_duplicate_email_returns_400() {
        var body = Map.of("name", "Alice", "email", "dup@test.com",
                "password", "pass123", "role", "student");

        // First registration succeeds
        client.post().uri("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON).body(body)
                .retrieve().toBodilessEntity();

        // Second must fail with 400
        ResponseEntity<Object> resp = client.post().uri("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON).body(body)
                .retrieve()
                .onStatus(s -> s.is4xxClientError(), (req, res) -> {})
                .toEntity(Object.class);

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    // ─── Login ────────────────────────────────────────────────────────────────

    @Test
    void login_success() {
        var reg = Map.of("name", "Carol", "email", "carol@test.com",
                "password", "mypassword", "role", "student");
        client.post().uri("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON).body(reg)
                .retrieve().toBodilessEntity();

        var creds = Map.of("email", "carol@test.com", "password", "mypassword");
        ResponseEntity<User> resp = client.post().uri("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON).body(creds)
                .retrieve().toEntity(User.class);

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(resp.getBody().getEmail()).isEqualTo("carol@test.com");
    }

    @Test
    void login_wrong_password_returns_401() {
        var reg = Map.of("name", "Dave", "email", "dave@test.com",
                "password", "correctpass", "role", "student");
        client.post().uri("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON).body(reg)
                .retrieve().toBodilessEntity();

        var creds = Map.of("email", "dave@test.com", "password", "wrongpass");
        ResponseEntity<Object> resp = client.post().uri("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON).body(creds)
                .retrieve()
                .onStatus(s -> s.is4xxClientError(), (req, res) -> {})
                .toEntity(Object.class);

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }

    @Test
    void login_unknown_email_returns_401() {
        var creds = Map.of("email", "nobody@test.com", "password", "anything");
        ResponseEntity<Object> resp = client.post().uri("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON).body(creds)
                .retrieve()
                .onStatus(s -> s.is4xxClientError(), (req, res) -> {})
                .toEntity(Object.class);

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }
}
