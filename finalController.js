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
    // let hasResults = false;

    $scope.newWord = {lemma: '', definition: '', category: ''};

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
                for (let i = 0; i < response[1].length; i++) {
                    console.log("Entered for loop");
                    console.log(response[1]);
                    console.log(response[3]);
                    $scope.results.push({'lemma': response[1][i], 'link': response[3][i]});
                }
                console.log("Results:");
                console.log($scope.results);
                console.log($scope.results[0]);
                }).catch(function(error) {console.log(error);});
    }

    $scope.addWord = function() {
        console.log("Adding a word");
        // Create dialog box - have it update newWord - push newWord to words
        addDialog.showModal();
    }

    $scope.confirmAdd = function() {
        console.log($scope.newWord);
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

    // $scope.showResults = function() {
    //     hasResults = true;
    // }

    // $scope.$watch('results', function() {
    //     console.log("Results changed");
    //     if (results) {
    //         $scope.showResults();
    //     }
    // })

    }
);