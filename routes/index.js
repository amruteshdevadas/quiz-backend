var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
var User = require("../models/user");
var questionBankModel = require('../models/questionbank')
var bcrypt = require('bcrypt')
var authorize = require('../helpers')
var quizResult = require('../models/quizResults')
var configModel = require('../models/config')


/* GET home page. */
router.get('/', authorize, function (req, res, next) {
  res.render('index', { title: 'Express' });
});

// User login route
router.post('/login', async (req, res) => {
  // Get email and password from request body
  const { email, password } = req.body;
  const secretKey = 'my_secret_key';

  try {
    // Find user with given email
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (isMatch) {
      console.log(user, "user")
      // The password is correct
      // Create a JWT token with user's id and email
      const token = jwt.sign({
        id: user.id,
        email: user.email,
        userType: user.user_type
      }, secretKey, { expiresIn: '24h' });
      // Return the JWT token to the client
      res.json({ token });
    } else {
      // The password is incorrect
      return res.status(400).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/questions', authorize, async function (req, res, next) {


  try {
    let data = await questionBankModel.find()
    res.send(data)
  } catch (error) {
    console.log(error)
    res.errored("Something went wrong")
  }
})

router.get('/question/:questionId', authorize, async function (req, res, next) {
  try {
    let { questionId } = req.params
    if (!questionId) return
    let data = await questionBankModel.findById(questionId)
    res.send(data)
  } catch (error) {
    console.log(error)
    res.errored("Something went wrong")
  }

})

router.get('/random-questions', authorize, async function (req, res, next) {

  try {

    let payload = req.query
    if (!payload) res.status(500).json({ error: "categories and limit is required" });

    const { categories, limit } = payload
    const queries = categories.split(',').map(category => {
      return questionBankModel.find({ question_category: category }).limit(limit).lean().exec();
    });

    Promise.all(queries)
      .then(results => {
        res.send(results.flat());
      })
      .catch(err => console.error(err))

  } catch (error) {
    console.log(error)
  }
})

router.post('/save-results', authorize, async function (req, res, next) {
  try {
    let payload = req.body
    if (!payload) return res.status(400).json({ error: "Payload is required..!" })
    let newData = new quizResult(payload)
    await newData.save(payload)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Something went wrong..!" })
  }
})

router.get('/question-category', authorize, async function (req, res, next) {
  try {

    let data = await configModel.findOne({ config_name: 'question-category' })
    if (!data) res.status(400).json({ error: "Config not found..!" })
    res.send(data)

  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Config not found..!" })
  }
})

router.get('/quiz-result', authorize, async function (req, res, next) {
  try {
    let user_id = req.query?.user_id
    if (!user_id) res.status(400).json({ error: "user Id or user tyepe required..!" })
    let user = await User.findById(user_id)
    let payload = {}
    if (user.user_type === 'user') payload = { quiz_user_id: user_id }
    let data = await quizResult.find(payload)
    res.send(data)
  }
  catch (err) {
    console.log(err)
    res.status(400).json({ error: "Results not found..!" })
  }
})

router.get('/quiz-result/:id', authorize, async function (req, res, next) {
  try {
    let resultId = req.params.id
    if (!resultId) res.status(400).json({ error: "Result Id is required..!" })
    let data = await quizResult.findById(resultId)
    res.send(data)
  }
  catch (err) {
    console.log(err)
    res.status(400).json({ error: "Results not found..!" })
  }
})


module.exports = router;
