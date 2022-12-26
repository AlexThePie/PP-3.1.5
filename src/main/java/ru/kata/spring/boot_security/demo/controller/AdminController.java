package ru.kata.spring.boot_security.demo.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.UserService;
import ru.kata.spring.boot_security.demo.service.UserServiceImpl;
import java.security.Principal;


@Controller
@RequestMapping("/admin")
public class AdminController {
    private final UserService userService;

    @Autowired
    public AdminController(UserServiceImpl userService) {
        this.userService = userService;
    }
    @GetMapping
    public String showAllUsers(Model model, Principal principal) {
        model.addAttribute("users", userService.getAllUsers());
        User princ = userService.findUserByUsername(principal.getName());
        model.addAttribute("princ", princ);
        model.addAttribute("titleTable", "Список всех пользователей:");
        return "admin";
    }
    @GetMapping("/{id}")
    public String showUser(Model model, @PathVariable("id") Long id) {
        model.addAttribute("user", userService.getUser(id));
        model.addAttribute("titleTable", "Страница пользователя:");
        return "user";
    }
    @GetMapping("/user-create")
    public String addNewUser(@ModelAttribute("user") User user ) {
        return "admin";
    }
    @PostMapping("/user-create")
    public String addCreateNewUser( User user) {
        try {
            userService.createNewUser(user);
        } catch (Exception er) {
            System.err.println("Пользователь с таким email уже существует!");
        }return "redirect:/admin";
    }
    @PatchMapping("/user-update")
    public String updateUser(User user) {
        userService.updateUser(user);
        return "redirect:/admin";
    }
    @GetMapping("/user-update/{id}")
    public String updateUserForm(@PathVariable("id") Long id, Model model) {
        model.addAttribute("user", userService.getUser(id));
        return "admin";
    }
    @DeleteMapping("/user-delete")
    public String deleteUser(Long id) {
        userService.deleteUser(id);
        return "redirect:/admin";
    }
    @GetMapping("/delete/{id}")
    public String deleteUserForm(@PathVariable("id") Long id, Model model) {
        model.addAttribute("user", userService.getUser(id));
        return "admin";
    }



}
