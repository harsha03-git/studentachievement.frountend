package com.achievepro.backend.controller;

import com.achievepro.backend.model.Achievement;
import com.achievepro.backend.repository.AchievementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/achievements")
public class AchievementController {

    @Autowired
    private AchievementRepository achievementRepository;

    @GetMapping
    public List<Achievement> getAllAchievements() {
        return achievementRepository.findAll();
    }

    @GetMapping("/student/{studentId}")
    public List<Achievement> getAchievementsByStudent(@PathVariable String studentId) {
        return achievementRepository.findByStudentId(studentId);
    }

    @PostMapping
    public Achievement submitAchievement(@RequestBody Achievement achievement) {
        return achievementRepository.save(achievement);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable String id, @RequestBody Map<String, String> body) {
        Optional<Achievement> opt = achievementRepository.findById(id);
        if (opt.isPresent()) {
            Achievement a = opt.get();
            a.setStatus(body.get("status"));
            return ResponseEntity.ok(achievementRepository.save(a));
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}/feedback")
    public ResponseEntity<?> updateFeedback(@PathVariable String id, @RequestBody Map<String, String> body) {
        Optional<Achievement> opt = achievementRepository.findById(id);
        if (opt.isPresent()) {
            Achievement a = opt.get();
            a.setFeedback(body.get("feedback"));
            return ResponseEntity.ok(achievementRepository.save(a));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAchievement(@PathVariable String id) {
        achievementRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
