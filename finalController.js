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
    let results = [];
    let newWord;
    let hasResults = false;

    if (window.localStorage.getItem("conlang_wordlist")) {
        $scope.words = JSON.parse(window.localStorage.getItem("conlang_wordlist"));
    }
    else {
        $scope.words = exampleWords;
    }
    
    $scope.checkWord = function(index) {
        let sendWord = $scope.words[index].lemma;
        console.log(sendWord);
        let fullUrl = apiUrl + "?origin=*&action=opensearch&search=" + sendWord + "&namespace=*";
        fetch(fullUrl).
            then(function(response) {return response.json();}).
            then(function(response) {
                console.log("Response:");
                console.log(response);
                let responseArray = response;
                console.log(responseArray);
                for (let i = 0; i < responseArray[1].length; i++) {
                    console.log("Entered for loop");
                    console.log(responseArray[1]);
                    console.log(responseArray[3]);
                    let tempArray = [];
                    tempArray.push(responseArray[1][i]);
                    tempArray.push(responseArray[3][i]);
                    console.log(tempArray);
                    results.push(tempArray);
                }
                console.log("Results:");
                console.log(results);
                }).catch(function(error) {console.log(error);});
    }

    $scope.addWord = function() {
        console.log("Adding a word");
        // Create dialog box - have it update newWord - push newWord to words
        $scope.addDialog = getElementById("addDialog");
        $scope.addDialog.showModal();
    }

    $scope.confirmAdd = function() {
        $scope.words.push(newWord);
        $scope.addDialog.close();
    }

    $scope.cancelAdd = function() {
        $scope.newWord = null;
        $scope.addDialog.close();
    }

    $scope.saveList = function() {
        window.localStorage.setItem("conlang_wordlist", JSON.stringify($scope.words));
    }

    $scope.showResults = function() {
        $scope.hasResults = true;
    }

    $scope.$watch('results', function() {
        console.log("Results changed");
        if (results) {
            $scope.showResults();
        }
    })

    }
);