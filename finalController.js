angular.module('myApp', [])
.controller('FinalController', function ($scope) {

    const exampleWords = [
        {lemma: 'apfel', definition: 'apple', category: 'food'},
        {lemma: 'banane', definition: 'banana', category: 'food'},
        {lemma: 'gato', definition: 'cat', category: 'animal'},
        {lemma: 'pes', definition: 'dog', category: 'animal'}
    ];
    const apiUrl = "https://en.wiktionary.org/w/api.php";
    const addDialog = document.getElementById("addDialog");
    const downloadDialog = document.getElementById("downloadDialog");
    const uploadDialog = document.getElementById("uploadDialog");
    let apiResponse = [];

    $scope.newWord = {lemma: '', definition: '', category: ''};
    $scope.generator = {syllableCount: 2, onsetConsCount: 2, codaConsCount: 1};
    $scope.uploadWords = [];

    if (window.localStorage.getItem("conlang_wordlist")) {
        $scope.words = JSON.parse(window.localStorage.getItem("conlang_wordlist"));
    }
    else {
        $scope.words = exampleWords;
    }

    $scope.generateWords = function() {
        console.log("Generating words...");
        console.log($scope.generator);
        let syllables = Math.round(Math.random() * Number($scope.generator.syllableCount));
        if (syllables == 0) {
            syllables = 1;
        }
        console.log(syllables);
        let onsets = Math.round(Math.random() * Number($scope.generator.onsetConsCount));
        console.log(onsets);
        let codas = Math.round(Math.random() * Number($scope.generator.codaConsCount));
        console.log(codas);
        let generatedWord = {lemma: '', definition: 'def', category: 'cat'};
        for (let i = 0; i < syllables; i++) {
            console.log("Entered for loop");
            let syll = generateSyllable(onsets, codas);
            console.log(syll);
            generatedWord.lemma += syll;
            console.log(generatedWord.lemma);
            console.log(generatedWord);
        }
        $scope.words.push(generatedWord);
    }

    generateSyllable = function(numOnset, numCoda) {
        console.log("Entered helper function");
        let vowelElems = document.getElementsByClassName('vowel');
        console.log(vowelElems);
        let consElems = document.getElementsByClassName('consonant');
        console.log(consElems);
        let vowelFound = false;
        let vowel = '';
        while (!vowelFound) {
            let randNum = Math.round(Math.random() * (vowelElems.length - 1));
            console.log(randNum);
            let possVowel = vowelElems.item(randNum);
            console.log(possVowel);
            if (possVowel.checked) {
                vowel = possVowel.id + '';
                console.log(vowel);
                vowelFound = true;
            }
        }
        let onset = '';
        let coda = '';
        for (let j = 0; j < numOnset; j++) {
            let consFound = false;
            let onsetLetter = '';
            while (!consFound) {
                let randNum = Math.round(Math.random() * (consElems.length - 1));
                console.log(randNum);
                let possOnset = consElems.item(randNum);
                console.log(possOnset);
                if (possOnset.checked) {
                    onsetLetter = possOnset.id + '';
                    console.log(onsetLetter);
                    consFound = true;
                }
            }
            onset += onsetLetter;
            console.log(onset);
        }
        for (let k = 0; k < numCoda; k++) {
            let consFound = false;
            let codaLetter = '';
            while (!consFound) {
                let randNum = Math.round(Math.random() * (consElems.length - 1));
                console.log(randNum);
                let possCoda = consElems.item(randNum);
                console.log(possCoda);
                if (possCoda.checked) {
                    codaLetter = possCoda.id + '';
                    console.log(codaLetter);
                    consFound = true;
                }
            }
            coda += codaLetter;
            console.log(coda);
        }
        let newSyllable = onset + vowel + coda;
        console.log(newSyllable);
        return newSyllable;
    }
    
    $scope.checkWord = function(index) {
        apiResponse = [];
        let sendWord = $scope.words[index].lemma;
        let fullUrl = apiUrl + "?origin=*&action=opensearch&search=" + sendWord + "&namespace=*";
        fetch(fullUrl).
            then(function(response) {return response.json();}).
            then(function(response) {
                for (let i = 0; i < response[1].length; i++) {
                    apiResponse.push({'lemma': response[1][i], 'link': response[3][i]});
                }
                $scope.updateResults(apiResponse);
                }).catch(function(error) {console.log(error);});
    }

    $scope.deleteWord = function(index) {
        $scope.words.splice(index, 1);
    }

    $scope.addWord = function() {
        $scope.newWord = {lemma: '', definition: '', category: ''};
        addDialog.showModal();
    }

    $scope.confirmAdd = function() {
        $scope.words.push($scope.newWord);
        addDialog.close();
    }

    $scope.cancelAdd = function() {
        $scope.newWord = {lemma: '', definition: '', category: ''};
        addDialog.close();
    }

    $scope.saveList = function() {
        window.localStorage.setItem("conlang_wordlist", JSON.stringify($scope.words));
    }

    $scope.saveFile = function() {
        $scope.downloadText = JSON.stringify($scope.words);
        downloadDialog.showModal();
    }

    $scope.closeDownload = function() {
        downloadDialog.close();
    }

    $scope.updateResults = function(newResults) {
        $scope.results = newResults;
        $scope.$apply();
    }

    $scope.uploadFile = function() {
        $scope.uploadWords = [];
        uploadDialog.showModal();
    }

    $scope.confirmUpload = function() {
        $scope.words = JSON.parse($scope.uploadWords);
        uploadDialog.close();
    }

    $scope.cancelUpload = function() {
        $scope.uploadWords = [];
        uploadDialog.close();
    }

    }
);