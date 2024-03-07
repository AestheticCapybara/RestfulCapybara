package org.aesthetic.restfulcapybara;

import org.aesthetic.restfulcapybara.entities.Name;
import org.aesthetic.restfulcapybara.entities.repos.NameRepo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.Random;

@RestController
@RequestMapping(path = "/restfulCapybara")
public class NameController {
    @Autowired
    private NameRepo nameRepo;

    @GetMapping(path = "/names")
    ResponseEntity<Name> get(@RequestParam Long id) {
        Optional<Name> name = nameRepo.findById(id);

        return name.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    @GetMapping(path = "/names/random")
    ResponseEntity<Name> getRandom() {
        Random random = new Random();
        Optional<Name> randomName = nameRepo.findById(random.nextLong(nameRepo.count()));

        return randomName.map(name -> new ResponseEntity<>(name, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
}
