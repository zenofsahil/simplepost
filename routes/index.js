exports.index = function(db){
  return function(req, res){

    var query = 'SELECT * FROM simple_posts ORDER BY id DESC';

    db.query(query, function(err, rows, fields){
      if(err) throw err;
      var posts = [];

      for(var i=0; i<rows.length; i++){
        posts.push([rows[i].user, rows[i].title, rows[i].post]);
      };
      res.render('index', { "posts": posts, title: 'Posts' });
    });
  };
};


exports.post = function(req, res){
  res.render('post', { title: 'Make a post'});
};

exports.makepost = function(db){
  return function(req, res){
    //var user = req.body.user;
    var user = req.session.user_id;
    var title = req.body.title;
    var post_body = req.body.post_body;
    var query = "INSERT INTO simple_posts (user, title, post) VALUES (? , ? , ?)";
    db.query(query, [user, title, post_body], function(err){
      if(err) throw err;
      console.log('Post added...');
      res.redirect('/');
    });
  }
};

exports.loginpage = function(req, res){
  res.render('loginpage', { title: 'User Login'});
};

exports.login = function(db){
  return function(req, res, next){
    var query = 'SELECT password, user FROM accounts WHERE email=?';
    var email = req.body.email;
    //query = query.replace("~email~", email);
    if(email.match('@')==null){
      res.redirect('/login');
    } else {

      db.query(query, email, function(err, rows, fields){
        if(err) throw err;
        if(rows.length==0){
          res.redirect('/login');
        }
        else {

          var database_pass = rows[0].password;
          var database_user = rows[0].user;


          if (database_pass == req.body.password){
            req.session.user_id = database_user;
            res.redirect('/post');
          } else {
            res.redirect('/login');
          }
        }
      }); 
    }
  };
};

exports.usersignup = function(req, res){
  res.render('user-registration', { title: 'New User'});
};

exports.registeruser = function(db){
  return function(req, res){
    //We have feilds for user , password and email
    var user = req.body.user;
    var password = req.body.password;
    var confirm_password = req.body.confirm_password;
    var email = req.body.email;

    var query = "INSERT INTO accounts VALUES (? , ? , ?)";
    
    if(check_credentials(password, confirm_password, email, user, db)){
      db.query(query, [user, password, email], function(err){
        if(err) throw err;
        console.log('New User Registration: ', user);
        req.session.user_id = user;
        res.redirect('/');
      });
    } 
    else{ 
      res.redirect('/register');
      //error
    };

    function check_credentials(password, cpassword, email, user, db){
      var clear = true;
      if ((password != cpassword) || (password.length==0) || (user.length==0)){
        clear = false;
        return clear;
      }
      return clear
      //add check for pre-existing email
      //add sanitization check for email
    }

  }
};
