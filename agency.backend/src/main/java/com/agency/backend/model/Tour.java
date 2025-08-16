package com.agency.backend.model;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tours")
public class Tour {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private String location;
    private String departureTime; // <- replaced duration with departureTime
    private String image;
    private double price;
    private double rating;
    private int maxGuests;

    private String routeDescription;
    private String startLocationLink;

    // Temporarily comment out highlights to test
    /*
    @ElementCollection
    @CollectionTable(name = "tour_highlights", joinColumns = @JoinColumn(name = "tour_id"))
    @Column(name = "highlight")
    private List<String> highlights = new ArrayList<>();
    */

    public Tour() { }

    public Tour(String title,
                String description,
                String location,
                String departureTime,
                String image,
                double price,
                double rating,
                int maxGuests,
                String routeDescription,
                String startLocationLink,
                List<String> highlights) {
        this.title = title;
        this.description = description;
        this.location = location;
        this.departureTime = departureTime;
        this.image = image;
        this.price = price;
        this.rating = rating;
        this.maxGuests = maxGuests;
        this.routeDescription = routeDescription;
        this.startLocationLink = startLocationLink;
        // this.highlights = highlights;
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getDepartureTime() {
        return departureTime;
    }

    public void setDepartureTime(String departureTime) {
        this.departureTime = departureTime;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public double getRating() {
        return rating;
    }

    public void setRating(double rating) {
        this.rating = rating;
    }

    public int getMaxGuests() {
        return maxGuests;
    }

    public void setMaxGuests(int maxGuests) {
        this.maxGuests = maxGuests;
    }

    public String getRouteDescription() {
        return routeDescription;
    }

    public void setRouteDescription(String routeDescription) {
        this.routeDescription = routeDescription;
    }

    public String getStartLocationLink() {
        return startLocationLink;
    }

    public void setStartLocationLink(String startLocationLink) {
        this.startLocationLink = startLocationLink;
    }

    /*
    public List<String> getHighlights() {
        return highlights;
    }

    public void setHighlights(List<String> highlights) {
        this.highlights = highlights;
    }
    */
}
