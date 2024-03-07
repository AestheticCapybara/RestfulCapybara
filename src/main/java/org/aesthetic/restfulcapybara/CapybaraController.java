package org.aesthetic.restfulcapybara;

import org.aesthetic.restfulcapybara.entities.Capybara;
import org.aesthetic.restfulcapybara.entities.Name;
import org.aesthetic.restfulcapybara.entities.repos.CapybaraRepo;
import org.aesthetic.restfulcapybara.entities.repos.NameRepo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@RestController
@RequestMapping(path = "/restfulCapybara")
public class CapybaraController {
    @Autowired
    private CapybaraRepo capybaraRepo;
    @Autowired
    private NameRepo nameRepo;

    @GetMapping(path = "/capybaras")
    ResponseEntity<Capybara> get(@RequestParam Long id) {
        Optional<Capybara> capybara = capybaraRepo.findById(id);
        return capybara.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    @GetMapping(path = "/capybaras/all")
    ResponseEntity<Iterable<Capybara>> getAll() {
        return new ResponseEntity<>(capybaraRepo.findAll(), HttpStatus.OK);
    }

    @PostMapping(path = "/capybaras")
    ResponseEntity<Capybara> create(@RequestParam Long nameId) {
        Name capybaraName = nameRepo.findById(nameId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Name not found"));

        Capybara capybara = new Capybara();
        capybara.setName(capybaraName);
        capybaraRepo.save(capybara);
        return new ResponseEntity<>(capybara, HttpStatus.CREATED);
    }

    @DeleteMapping(path = "/capybaras")
    ResponseEntity<Capybara> delete(@RequestParam Long id) {
        Optional<Capybara> capybara = capybaraRepo.findById(id);
        capybaraRepo.deleteById(id);
        return capybara.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    @DeleteMapping(path = "/capybaras/all")
    ResponseEntity<Iterable<Capybara>> deleteAll() {
        Iterable<Capybara> capybaras = capybaraRepo.findAll();
        capybaraRepo.deleteAll();
        return new ResponseEntity<>(capybaras, HttpStatus.OK);
    }
}
