package com.achievepro.backend.controller;

import com.achievepro.backend.model.User;
import com.achievepro.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/students")
    public List<User> getStudents() {
        return userRepository.findByRole("student");
    }

    @GetMapping("/teachers")
    public List<User> getTeachers() {
        return userRepository.findByRole("teacher");
    }

    @PutMapping("/students/{id}/assign")
    public ResponseEntity<?> assignTeacher(@PathVariable String id, @RequestBody Map<String, String> body) {
        Optional<User> studentOpt = userRepository.findById(id);
        if (studentOpt.isPresent()) {
            User student = studentOpt.get();
            student.setTeacherId(body.get("teacherId"));
            userRepository.save(student);
            return ResponseEntity.ok(student);
        }
        return ResponseEntity.notFound().build();
    }
}
