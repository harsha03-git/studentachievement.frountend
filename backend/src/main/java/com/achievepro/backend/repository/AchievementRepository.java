package com.achievepro.backend.repository;

import com.achievepro.backend.model.Achievement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AchievementRepository extends JpaRepository<Achievement, String> {
    List<Achievement> findByStudentId(String studentId);
}
