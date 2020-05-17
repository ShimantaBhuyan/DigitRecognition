[![tensorflow](https://aleen42.github.io/badges/src/tensorflow.svg)](https://github.com/aleen42/badges)<sup>*</sup> [![js](https://aleen42.github.io/badges/src/javascript.svg)](https://github.com/aleen42/badges)
# Digit Recognition
Handwriting recognition of numeric digits with TensorFlowJS

## Motivation
* To get going with TensorFlowJS
* Explore scope of ML for the web

## Built With
* [TensorFlow.JS](https://www.tensorflow.org/js) - library for machine learning in JavaScript
* [Material Design Lite](https://getmdl.io/) - Material Design look and feel

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## Setup for Contributors
* Go through this [Google Codelab](https://codelabs.developers.google.com/codelabs/tfjs-training-classfication) if you are new to tensorflow and machine learning in general like me!
* Check out `data.js` to know how the data has been fetched, and other helper functions to fetch data from the dataset during training.
* Check out `script.js` to see the backbone of this project: how model is created, training is done etc. Optimizations are most welcome!
* Try out `saveModel.html` to save the model in a json file to be used when we predict user drawing.
* Check out `digit_recognition.js` to see how the saved model is used to predict the digit drawn on the canvas in `index.html`
* `digit.css` for styling the main page

## TODO
- [x] Make drawing canvas resizable
- [ ] Make predictions more accurate
- [x] Create new UI
- [ ] Add chart data for predictions
- [ ] Train model with wrong predictions

## Inspired from 
[Benson Ruan](https://bensonruan.com/)'s work

## NOTE
There are times when the prediction shown is utterly wrong. Pardon my basic ML skills!
<br>Need to train the/use a better model.

### #MadeWithTFJS 

\*This project uses [TensorFlow.JS](https://www.tensorflow.org/js)