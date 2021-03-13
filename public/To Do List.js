$(document).ready(function() {

    $("#loginButton").on("click", function() {

        var user = document.getElementById("username").value.toLowerCase();
        var password = document.getElementById("password").value;

        $.ajax({
            url: "http://localhost:3000/users",
            type: "post",
            data: {username: user, pass: password},
            success: function(res) {

                var newUser = document.getElementById("newUser");
                var passwordError = document.getElementById("passwordError");

                function login() {

                    var x = document.getElementsByClassName("list");
                    var y = document.getElementsByClassName("login");
                
                    for (var i = 0; i < y.length; i++) {
                
                        y[i].style.display = "none";
                
                    }
                
                    for (var i = 0; i < x.length; i++) {
                
                        x[i].style.display = "block";
                
                    }
                
                    passwordError.style.display = "none";

                }

                for (var i = 0; i < res.length; i++) {

                    if (res[i].username == user) {

                        var userID = res[i].userID;

                        $.ajax({
                            url: "http://localhost:3000/comparePassword",
                            type: "post",
                            data: {username: user, pass: password},
                            success: function(res) {

                                if (res) {

                                    login();
    
                                    $.ajax({
                                        url: "http://localhost:3000/list",
                                        type: "post",
                                        data: {userID: userID},
                                        success: function(res) {
                        
                                            for (var i = 0; i < res.length; i++) {
    
                                                if (res[i].userID == userID) {
    
                                                    let title = res[i].title;
                                                    let desc = res[i].dsc;
                                                    let li = document.createElement("li");
                                                    let t = document.createTextNode(title + ": " + desc);
                                                    var edit = 0;
    
                                                    li.appendChild(t);
                                                    document.getElementById("List").appendChild(li);
    
                                                    let listID = document.createElement("p");
                                                    listID.innerText = res[i].ID;
                                                    listID.style.display = "none";
                                                    li.appendChild(listID);
            
                                                    let editButton = document.createElement("button");
                                                    editButton.innerHTML = "Edit";
                                                    editButton.className = "edit";
                                                    li.appendChild(editButton);
            
                                                    editButton.onclick = editList;
            
                                                    let spanRemove = document.createElement("span");
                                                    let txt = document.createTextNode("\u00D7");
                                                    spanRemove.className = "remove";
                                                    spanRemove.appendChild(txt);
                                                    li.appendChild(spanRemove);
            
                                                    spanRemove.onclick = removeList;
            
                                                    function removeList() {
    
                                                        $.ajax({
                                                            url: "http://localhost:3000/removeList",
                                                            type: "post",
                                                            data: {userID: userID, listID: listID.innerText},
                                                            success: function(res) {
    
                                                            
    
                                                            }
                                                        })
            
                                                        let div = this.parentElement;
                                                        div.remove();
            
                                                    }
            
                                                    function editList() {

                                                        if (this.innerHTML == "Edit" && edit == 1) {

                                                            editError.style.display = "initial";

                                                        }
            
                                                        if (this.innerHTML == "Edit" && edit == 0) {
                
                                                            edit = 1;
                                                            this.innerHTML = "Save";
                        
                                                            let inputTitle = document.createElement("input");
                                                            inputTitle.value = title;
                                                            inputTitle.className = "inputTitle";
                                                            inputTitle.id = "inputTitle";
                                                            inputTitle.type = "text";
                        
                                                            let inputDesc = document.createElement("input");
                                                            inputDesc.value = desc;
                                                            inputDesc.className = "inputDesc";
                                                            inputDesc.id = "inputDesc";
                                                            inputDesc.type = "text";
                        
                                                            li.removeChild(t);
                                                            li.appendChild(inputTitle);
                                                            li.appendChild(inputDesc);
                        
                                                        } else if (this.innerHTML == "Save" && edit == 1) {
                        
                                                            edit = 0;
                                                            this.innerHTML = "Edit";
                                                            editError.style.display = "none";
    
                                                            $.ajax({
                                                                url: "http://localhost:3000/editList",
                                                                type: "post",
                                                                data: {inputTitle: inputTitle.value, inputDesc: inputDesc.value, userID: userID, listID: listID.innerText},
                                                                success: function(res) {
    
                                                                    title = document.getElementById("inputTitle").value;
                                                                    desc = document.getElementById("inputDesc").value;
        
                                                                    let titleElement = document.getElementById("inputTitle");
                                                                    let descElement = document.getElementById("inputDesc");
            
                                                                    titleElement.parentNode.removeChild(titleElement);
                                                                    descElement.parentNode.removeChild(descElement);
                        
                                                                    t = document.createTextNode(title + ": " + desc);
                        
                                                                    li.appendChild(t);
    
                                                                }
                                                            })
            
                                                        }
            
                                                    }
                                
                                                }
                                
                                            }
                        
                                        }
                                    })

                                } else {

                                    passwordError.style.display = "initial";

                                }
    
                            }

                        })

                        break;

                    } else if (i == res.length - 1) {

                        newUser.style.display = "initial";
                        login();

                    }

                }

            }

        })

    });

    $("#listButton").on("click", function() {

        var user = document.getElementById("username").value;
        var title = document.getElementById("title").value;
        var desc = $('textarea[name = "Description"]').val();
        var li = document.createElement("li");
        var t = document.createTextNode(title + ": " + desc);

        $.ajax({
            url: "http://localhost:3000/checkUserID",
            type: "post",
            data: {username: user},
            success: function(res) {

                var userID = res[0].userID;

                $.ajax({
                    url: "http://localhost:3000/createList",
                    type: "post",
                    data: {title: title, desc: desc, userID: userID},
                    success: function(res) {
        
                        li.appendChild(t);
        
                        if (title === '' || desc === '') {
        
                            alert("You must fill out the fields!");
        
                        } else {
        
                            document.getElementById("List").appendChild(li);
        
                        }
        
                        document.getElementById("title").value = "";
                        document.getElementById("desc").value = "";
        
                        var editButton = document.createElement("button");
                        editButton.innerHTML = "Edit";
                        editButton.className = "edit";
                        li.appendChild(editButton);
        
                        editButton.onclick = editList;
        
                        let spanRemove = document.createElement("span");
                        let txt = document.createTextNode("\u00D7");
                        spanRemove.className = "remove";
                        spanRemove.appendChild(txt);
                        li.appendChild(spanRemove);
        
                        spanRemove.onclick = removeList;
        
                        function removeList() {
        
                            let div = this.parentElement;
                            div.remove();
        
                        }
        
                        function editList() {
        
                            if (this.innerHTML == "Edit") {
            
                                this.innerHTML = "Save";
                    
                                var inputTitle = document.createElement("input");
                                inputTitle.value = title;
                                inputTitle.className = "inputTitle";
                                inputTitle.id = "inputTitle";
                                inputTitle.type = "text";
                    
                                var inputDesc = document.createElement("input");
                                inputDesc.value = desc;
                                inputDesc.className = "inputDesc";
                                inputDesc.id = "inputDesc";
                                inputDesc.type = "text";
                    
                                li.removeChild(t);
                                li.appendChild(inputTitle);
                                li.appendChild(inputDesc);
                    
                            } else if (this.innerHTML == "Save") {
                    
                                this.innerHTML = "Edit";
        
                                title = document.getElementById("inputTitle").value;
                                desc = document.getElementById("inputDesc").value;
    
                                let titleElement = document.getElementById("inputTitle");
                                let descElement = document.getElementById("inputDesc");
        
                                titleElement.parentNode.removeChild(titleElement);
                                descElement.parentNode.removeChild(descElement);
                    
                                t = document.createTextNode(title + ": " + desc);
                    
                                li.appendChild(t);
        
                            }
        
                        }
        
                    }
                })

            }
        })

    });

    $("#signOut").on("click", function() {

        var x = document.getElementsByClassName("list");
        var y = document.getElementsByClassName("login");
        var newUser = document.getElementById("newUser");

        for (var i = 0; i < x.length; i++) {
    
            x[i].style.display = "none";
    
        }
    
        for (var i = 0; i < y.length; i++) {
    
            y[i].style.display = "block";
    
        }

        newUser.style.display = "none";

        $("ul").empty();

    });

});