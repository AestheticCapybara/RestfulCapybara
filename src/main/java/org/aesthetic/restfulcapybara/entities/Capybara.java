package org.aesthetic.restfulcapybara.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "capybaras")
public class Capybara {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Name name;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Name getName() {
        return name;
    }

    public void setName(Name name) {
        this.name = name;
    }
}
