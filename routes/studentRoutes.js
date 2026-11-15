const express = require("express");

const router = express.Router();

const students = require("../data/students");


// ==========================================
// GET /students
// Get all students
// ==========================================

router.get("/", (req, res) => {

    res.status(200).json({
        success: true,
        count: students.length,
        students: students
    });

});


// ==========================================
// GET /students/:id
// Get one student by ID
// ==========================================

router.get("/:id", (req, res) => {

    const id = parseInt(req.params.id);

    const student = students.find(
        student => student.id === id
    );

    if (!student) {

        return res.status(404).json({
            success: false,
            message: "Student not found"
        });

    }

    res.status(200).json({
        success: true,
        student: student
    });

});


// ==========================================
// POST /students
// Create a new student
// ==========================================

router.post("/", (req, res) => {

    const {
        name,
        age,
        course,
        email
    } = req.body;


    // Check required fields

    if (!name || !age || !course || !email) {

        return res.status(400).json({
            success: false,
            message: "Name, age, course and email are required"
        });

    }


    // Generate new ID

    const newId = students.length > 0
        ? Math.max(...students.map(student => student.id)) + 1
        : 1;


    // Create new student

    const newStudent = {

        id: newId,

        name: name,

        age: age,

        course: course,

        email: email

    };


    // Add student to array

    students.push(newStudent);


    // Send response

    res.status(201).json({

        success: true,

        message: "Student created successfully",

        student: newStudent

    });

});


// ==========================================
// PUT /students/:id
// Update a student
// ==========================================

router.put("/:id", (req, res) => {

    const id = parseInt(req.params.id);


    // Find student

    const student = students.find(
        student => student.id === id
    );


    // If student doesn't exist

    if (!student) {

        return res.status(404).json({
            success: false,
            message: "Student not found"
        });

    }


    const {
        name,
        age,
        course,
        email
    } = req.body;


    // Check required fields

    if (!name || !age || !course || !email) {

        return res.status(400).json({
            success: false,
            message: "Name, age, course and email are required"
        });

    }


    // Update student

    student.name = name;

    student.age = age;

    student.course = course;

    student.email = email;


    // Send response

    res.status(200).json({

        success: true,

        message: "Student updated successfully",

        student: student

    });

});


// ==========================================
// DELETE /students/:id
// Delete a student
// ==========================================

router.delete("/:id", (req, res) => {

    const id = parseInt(req.params.id);


    // Find student index

    const studentIndex = students.findIndex(
        student => student.id === id
    );


    // If student doesn't exist

    if (studentIndex === -1) {

        return res.status(404).json({
            success: false,
            message: "Student not found"
        });

    }


    // Delete student

    const deletedStudent =
        students.splice(studentIndex, 1);


    // Send response

    res.status(200).json({

        success: true,

        message: "Student deleted successfully",

        student: deletedStudent[0]

    });

});


module.exports = router;