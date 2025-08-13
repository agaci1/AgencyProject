package com.agency.backend.repository;

import com.agency.backend.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.repository.query.Param;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    @Modifying
    @Transactional
    @Query("DELETE FROM Booking b WHERE b.tour.id = :tourId")
    void deleteByTourId(@Param("tourId") Long tourId);
}
