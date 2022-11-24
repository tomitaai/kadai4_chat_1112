    // <!--** 以下Firebase **-->
        // Import the functions you need from the SDKs you need
        import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-app.js";

        // 貼り付ける場所
        import { 
            getDatabase, 
            ref, 
            push, 
            set,
            update,
            onChildAdded, 
            remove, 
            onChildRemoved, 
            serverTimestamp, 
            onValue,
            query,
            orderByChild
        } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-database.js";


        // TODO: Add SDKs for Firebase products that you want to use
        // https://firebase.google.com/docs/web/setup#available-libraries

        // Your web app's Firebase configuration
        const firebaseConfig = {
        };

        // Initialize Firebase
        const app = initializeApp(firebaseConfig);

        const db = getDatabase(app);
        const dbRef = ref(db, '1112kadai');

        
        // function changeFontSize() {
        //     let textElem = document.querySelector(".postText");
        //     console.log(textElem.getBoundingClientRect().height);
        //     console.log(textElem.scrollHeight);
        //     for (
        //         let size = 1;
        //         textElem.getBoundingClientRect().height < textElem.scrollHeight && size >= 0.375;
        //         size -= 0.0625
        //     ) {
        //         textElem.style.fontSize = size + "rem";
        //         textElem.style.overflow = 'scroll';
        //         let targetKey = $('postText').parents('.msg').data("date");
        //         update(ref(db, "1112kadai/" + targetKey), {
        //             like: 100,
        //         });
        
            // }
            // for (
            //     let size = 1;
            //     textElem.getBoundingClientRect().height > textElem.scrollHeight && size < 20;
            //     size += 0.0625
            // ) {
            //     textElem.style.fontSize = size + "rem";
            // }

            // }
            

        //ウインドウサイズを変えたとき
        // window.addEventListener('changeFontSize', () => {
        //     changeFontSize();
        // });

        
        // 送信処理を記述
        $('#send').on('click', function () {

            const uname = $('#uname').val();
            // const uimg = $('#uimg').val();
            const text = $('#text').val();
            let like = 0;
            let col = 2;

            // 入力データをオブジェクトに入れる
            const msg = {
                uname: uname,
                // uimg: uimg,
                text: text,
                like: like,
                col: col,
                date: serverTimestamp()
            }

            // firebaseに送る準備をしていることになります🤗
            const newPostRef = push(dbRef) //データを送信できる準備
            set(newPostRef, msg); // firebaseの登録できる場所に保存するイメージです🤗

            location.href= "index.html";
            
        });


    // 受信処理を記述
    // （配列とonChildAddedを用いて、dateが大きい順の配列を作る）
        //firebase上のデータを取得し、日付昇順で並び替え
        onValue(dbRef, function (data) {
            const d = data.val();
            console.log(d, "firebaseの全データ");
            const v = query(ref(db, `1112kadai/`), orderByChild("date"));
            console.log(v); //debug

            let arrDate = []; //dateが大きい順に格納するローカル変数を宣言
            console.log(arrDate, "firebaseの全データ日付が大きい順");


        // 登録されたデータを取得します🤗
        onChildAdded(v, function (data) {
        console.log(data.key);
        console.log(data.val());
        const hash = {
            key: data.key,
            uname: data.val().uname,
            // uimg: data.val().uimg,
            text: data.val().text,
            like: data.val().like,
            col: data.val().col,
            date: data.val().date,
        };
        arrDate.unshift(hash); //unshiftで配列の先頭に追加する
        console.log(arrDate, "firebase全件のデータ(date昇順)");
        });
    

        let dd = arrDate.map((item, index) => {
        const d1 = new Date(item.date);
        // let year = d.getFullYear();
        let month = d1.getMonth() + 1;
        let day = d1.getDate(); 
        let hour = d1.getHours();
        let min = d1.getMinutes();
        // let sec = d.getSeconds();
        const d2 = new Date(item.col);
        let col = Math.floor(d2);

        // es6のテンプレートリテラル
        let h = `
            <div class="col-${col}">
                <div class="msg" data-date=${item.key}>
                    <div class="postRatingBtn">
                        <input type="image" src="img/good.png" alt="good" id="good"></input>
                        <input type="image" src="img/bad.png" alt="bad" id="bad"></input>
                    </div>
                    <div class="postLike">
                        <img class="heart" src="img/heart.png" alt="like">
                        <div class="likeCount">${item.like}件</div>
                    </div>
                    <div class="postText">${item.text}</div>
                    <div class="postUname">${item.uname}</div>
                    <div class="postDate">${month}月${day}日${hour}時${min}分</div>
                </div>
            </div>
        `;
        return h;
        });
        $("#output").html(dd);
        // changeFontSize();

    });


    // goodボタンクリックイベント
    $(document).on("click", "#good", function () {

        let targetKey = $(this).parents('.msg').data("date");
        console.log(targetKey);

        // 今のlike数取得
        const likeCountRef = ref(db, "1112kadai/" + targetKey + '/like');
        var likeCurrent;
        onValue(likeCountRef, (snapshot) => {
            likeCurrent = snapshot.val();
            console.log(likeCurrent);
        });

        // 今のcol数取得
        const colCountRef = ref(db, "1112kadai/" + targetKey + '/col');
        var colCurrent;
        onValue(colCountRef, (snapshot) => {
            colCurrent = snapshot.val();
            console.log(Math.floor((colCurrent)*10)/10);
            console.log(colCurrent);
        });

        // likeをカウントアップしたときのfunction
        function likeCountUp(){
            
            update(ref(db, "1112kadai/" + targetKey), {
                like: likeCurrent + 1,
                col: ((colCurrent * 10) + 1) / 10 //誤差修正（IEEE 754)
            });
            // changeFontSize();
        }
        
        likeCountUp();
    });
            


    // badボタンクリックイベント
    $(document).on("click", "#bad", function () {

        let targetKey = $(this).parents('.msg').data("date");
        console.log(targetKey);

        // 今のlike数取得
        const likeCountRef = ref(db, "1112kadai/" + targetKey + '/like');
        var likeCurrent;
        onValue(likeCountRef, (snapshot) => {
            likeCurrent = snapshot.val();
            console.log(likeCurrent);
        });

        // 今のcol数取得
        const colCountRef = ref(db, "1112kadai/" + targetKey + '/col');
        var colCurrent;
        onValue(colCountRef, (snapshot) => {
            colCurrent = snapshot.val();
            console.log(Math.floor((colCurrent)*10)/10);
            console.log(colCurrent);
        });

        // likeをカウントダウンしたときのfunction
        function likeCountDown(){
            
            update(ref(db, "1112kadai/" + targetKey), {
                like: likeCurrent - 1,
                col: ((colCurrent * 10) - 1) / 10 //誤差修正（IEEE 754)
            });
            // changeFontSize();
        }
        
        likeCountDown();
    });




    // 削除をボタンを押したら⇨アラートが出れば成功！！
    // $(document).on("click", "#delete", function () {
    //     let target = $(this).parent().data("date");
    //     remove(ref(db, "1112kadai/" + target));
    // });







