package com.achievepro.backend.controller;

import com.achievepro.backend.model.User;
import com.achievepro.backend.repository.UserRepository;
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
class UserControllerTest {

    @LocalServerPort
    int port;

    @Autowired
    UserRepository userRepository;

    RestClient client;
    private String studentId;
    private String teacherId;

    @BeforeEach
    void seed() {
        userRepository.deleteAll();
        client = RestClient.builder().baseUrl("http://localhost:" + port).build();

        User student = new User();
        student.setName("Student One");
        student.setEmail("s1@test.com");
        student.setPassword("pass");
        student.setRole("student");
        studentId = userRepository.save(student).getId();

        User teacher = new User();
        teacher.setName("Teacher One");
        teacher.setEmail("t1@test.com");
        teacher.setPassword("pass");
        teacher.setRole("teacher");
        teacherId = userRepository.save(teacher).getId();
    }

    // ─── GET /api/users/students ───────────────────────────────────────────────

    @Test
    void getStudents_returns_only_students() {
        List<User> students = client.get().uri("/api/users/students")
                .retrieve().body(new ParameterizedTypeReference<>() {});

        assertThat(students).hasSize(1);
        assertThat(students.get(0).getRole()).isEqualTo("student");
    }

    // ─── GET /api/users/teachers ───────────────────────────────────────────────

    @Test
    void getTeachers_returns_only_teachers() {
        List<User> teachers = client.get().uri("/api/users/teachers")
                .retrieve().body(new ParameterizedTypeReference<>() {});

        assertThat(teachers).hasSize(1);
        assertThat(teachers.get(0).getRole()).isEqualTo("teacher");
    }

    // ─── PUT /api/users/students/{id}/assign ──────────────────────────────────

    @Test
    void assignTeacher_success() {
        var body = Map.of("teacherId", teacherId);

        ResponseEntity<User> resp = client.put()
                .uri("/api/users/students/" + studentId + "/assign")
                .contentType(MediaType.APPLICATION_JSON).body(body)
                .retrieve().toEntity(User.class);

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(resp.getBody().getTeacherId()).isEqualTo(teacherId);
    }

    @Test
    void assignTeacher_student_not_found_returns_404() {
        var body = Map.of("teacherId", teacherId);

        ResponseEntity<Object> resp = client.put()
                .uri("/api/users/students/nonexistent-id/assign")
                .contentType(MediaType.APPLICATION_JSON).body(body)
                .retrieve()
                .onStatus(s -> s.is4xxClientError(), (req, res) -> {})
                .toEntity(Object.class);

        assertThat(resp.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }
}
