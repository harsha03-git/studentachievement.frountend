package com.achievepro.backend.controller;

import com.achievepro.backend.model.Achievement;
import com.achievepro.backend.repository.AchievementRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
class AchievementControllerTest {

    @LocalServerPort
    int port;

    @Autowired
    AchievementRepository achievementRepository;

    RestClient client;
    private String achievementId;
    private final String STUDENT_ID = "student-abc";

    @BeforeEach
    void seed() {
        achievementRepository.deleteAll();
        client = RestClient.builder().baseUrl("http://localhost:" + port).build();

        Achievement a = new Achievement();
        a.setTitle("Best Project");
        a.setCategory("Academic");
        a.setType("Individual");
        a.setStatus("pending");
        a.setDate("2026-01-15");
        a.setDescription("Award for best final year project");
        a.setStudentId(STUDENT_ID);
        a.setStudentName("Test Student");
        achievementId = achievementRepository.save(a).getId();
    }

    // ─── GET /api/achievements ────────────────────────────────────────────────

    @Test
    void getAllAchievements_returns_list() {
        List<Achievement> list = client.get().uri("/api/achievements")
                .retrieve().body(new ParameterizedTypeReference<>() {});

        assertThat(list).hasSize(1);
        assertThat(list.get(0).getTitle()).isEqualTo("Best Project");
    }

    // ─── GET /api/achievements/student/{studentId} ────────────────────────────

    @Test
    void getByStudent_returns_matching_achievements() {
        List<Achievement> list = client.get()
                .uri("/api/achievements/student/" + STUDENT_ID)
                .retrieve().body(new ParameterizedTypeReference<>() {});

        assertThat(list).hasSize(1);
        assertThat(list.get(0).getStudentId()).isEqualTo(STUDENT_ID);
    }

    @Test
    void getByStudent_returns_empty_for_unknown_student() {
        List<Achievement> list = client.get()
                .uri("/api/achievements/student/nobody")
                .retrieve().body(new ParameterizedTypeReference<>() {});

        assertThat(list).isEmpty();
    }

    // ─── POST /api/achievements ───────────────────────────────────────────────

    @Test
    void submitAchievement_creates_and_returns_record() {
        var body = Map.of(
                "title", "Science Olympiad",
                "category", "Competition",
                "type", "Team",
                "status", "pending",
                "date", "2026-03-10",
                "description", "Won silver medal",
                "studentId", "student-xyz",
                "studentName", "New Student"
        );

        ResponseEntity<Achievement> resp = client.post().uri("/api/achievements")
                .contentType(MediaType.APPLICATION_JSON).body(body)
                .retrieve().toEntity(Achievement.class);

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(resp.getBody().getId()).isNotBlank();
        assertThat(resp.getBody().getTitle()).isEqualTo("Science Olympiad");
        assertThat(resp.getBody().getStatus()).isEqualTo("pending");
    }

    // ─── PUT /api/achievements/{id}/status ───────────────────────────────────

    @Test
    void updateStatus_changes_status_to_approved() {
        var body = Map.of("status", "approved");

        ResponseEntity<Achievement> resp = client.put()
                .uri("/api/achievements/" + achievementId + "/status")
                .contentType(MediaType.APPLICATION_JSON).body(body)
                .retrieve().toEntity(Achievement.class);

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(resp.getBody().getStatus()).isEqualTo("approved");
    }

    @Test
    void updateStatus_unknown_id_returns_404() {
        var body = Map.of("status", "approved");

        ResponseEntity<Object> resp = client.put()
                .uri("/api/achievements/bad-id/status")
                .contentType(MediaType.APPLICATION_JSON).body(body)
                .retrieve()
                .onStatus(s -> s.is4xxClientError(), (req, res) -> {})
                .toEntity(Object.class);

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    // ─── PUT /api/achievements/{id}/feedback ─────────────────────────────────

    @Test
    void updateFeedback_saves_and_returns_feedback() {
        var body = Map.of("feedback", "Well done! Keep it up.");

        ResponseEntity<Achievement> resp = client.put()
                .uri("/api/achievements/" + achievementId + "/feedback")
                .contentType(MediaType.APPLICATION_JSON).body(body)
                .retrieve().toEntity(Achievement.class);

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(resp.getBody().getFeedback()).isEqualTo("Well done! Keep it up.");
    }

    @Test
    void updateFeedback_unknown_id_returns_404() {
        var body = Map.of("feedback", "Nice");

        ResponseEntity<Object> resp = client.put()
                .uri("/api/achievements/bad-id/feedback")
                .contentType(MediaType.APPLICATION_JSON).body(body)
                .retrieve()
                .onStatus(s -> s.is4xxClientError(), (req, res) -> {})
                .toEntity(Object.class);

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    // ─── DELETE /api/achievements/{id} ───────────────────────────────────────

    @Test
    void deleteAchievement_removes_record() {
        client.delete().uri("/api/achievements/" + achievementId)
                .retrieve().toBodilessEntity();

        List<Achievement> list = client.get().uri("/api/achievements")
                .retrieve().body(new ParameterizedTypeReference<>() {});

        assertThat(list).isEmpty();
    }
}
