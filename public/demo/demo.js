/*! demo.js */

var kagos = [];

$(function() {
  var param = {};
  param._ = function() {
    return Math.floor((new Date()).getTime() / 1000);
  };
  var server_file = {
    name: 'Server File',
    storage: 'http_jquery',
    endpoint: '/data/',
    http_param: param
  };
  var server_memory = {
    name: 'Server Memory',
    storage: 'http_jquery',
    endpoint: '/memory/',
    http_param: param
  };
  var local_memory = {
    name: 'Local Memory',
    storage: 'memory',
    namespace: 'kagodb',
    memory_serialize: true,
    primary_key: '_id'
  };
  var local_storage = {
    name: 'Local Storage',
    storage: 'local_storage',
    namespace: 'kagodb',
    memory_serialize: true
  };
  kagos.push(KagoDB(local_storage));
  kagos.push(KagoDB(local_memory));
  kagos.push(KagoDB(server_file));
  kagos.push(KagoDB(server_memory));
  showStorages(kagos);
});

function showStorages(kagos) {
  var ul = $('#storage-list');
  var head = ul.find('li:first');
  ul.empty();
  ul.append(head);
  kagos.forEach(function(kago) {
    var li = $('<li/>').appendTo(ul);
    var name = kago.get('name');
    li.data('kago', name);
    var a = $('<a/>').appendTo(li);
    a.text(name);
    a.attr('href', '#');
    a.on('click', function() {
      showKeys(kago);
    });
  });
  showKeys(kagos[0]);
}

function showKeys(kago, id) {
  $('#storage-list li.active').removeClass('active');
  var name = kago.get('name');
  $('#storage-list li').each(function(idx, elem) {
    var $elem = $(elem);
    if ($elem.data('kago') == name) {
      $elem.addClass('active');
    }
  });
  info('Loading: ' + name);
  kago.index(function(err, list) {
    if (err) {
      warn(err);
      return;
    }
    var ul = $('#index-list');
    var head = ul.find('li:first');
    ul.empty();
    head.text('KEYS (' + list.length + ')');
    ul.append(head);
    list.forEach(function(key) {
      var li = $('<li/>').appendTo(ul);
      li.data('key', key);
      var a = $('<a/>').appendTo(li);
      a.text(key);
      a.attr('href', '#');
      a.on('click', function() {
        showContent(kago, key);
      });
    });
    var li = $('<li/>').appendTo(ul);
    var a = $('<a/>').appendTo(li);
    a.text('(insert new item)');
    a.attr('href', '#');
    var nid = 'untitled ' + (new Date()).toJSON().replace(/T/, ' ').replace(/\.\d+Z$/, '');
    li.data('key', nid);
    var now = new Date();
    var item = {
      created_at: now
    };
    var content = JSON.stringify(item, null, " ");
    a.on('click', addNew);

    id = id || list[0];
    if (id) {
      showContent(kago, id);
    } else {
      addNew();
    }

    function addNew() {
      info('Enter new content: ' + name);
      clearContent(kago, nid, content);
    }
  });
}

function clearContent(kago, id, content) {
  $('#index-list li.active').removeClass('active');
  $('#index-list li').each(function(idx, elem) {
    var $elem = $(elem);
    if ($elem.data('key') == id) {
      $elem.addClass('active');
    }
  });

  var ftitle = $('#form-title');
  var fcontent = $('#form-content');
  var fdelete = $('#form-delete');
  var fwrite = $('#form-write');
  ftitle.val(id || '');
  fcontent.val(content || '');
  fdelete.addClass('disabled');
  fdelete.off();
  fwrite.off();
  fwrite.on('click', function() {
    var id = ftitle.val();
    var content = fcontent.val();
    var item;
    try {
      item = JSON.parse(content);
      var json = JSON.stringify(item, null, " ");
      fcontent.val(json);
    } catch (err) {
      warn(err);
      return;
    }
    kago.write(id, item, function(err) {
      if (err) {
        warn(err);
        return;
      }
      info('Saved: ' + id);
      showKeys(kago, id);
    })
  });
}

function showContent(kago, id) {
  clearContent(kago, id);
  var ftitle = $('#form-title');
  var fcontent = $('#form-content');
  var fdelete = $('#form-delete');
  fdelete.removeClass('disabled');
  ftitle.val('');
  fcontent.text('');
  fdelete.removeClass('disabled');
  fdelete.on('click', function() {
    eraseItem(kago, id);
  });

  info('Loading: ' + id);
  kago.read(id, function(err, item) {
    if (err) {
      warn(err);
      return;
    }
    ftitle.val(id);
    var json = JSON.stringify(item, null, " ");
    fcontent.val(json);
    info('Loaded: ' + id);
  });
}

function eraseItem(kago, id) {
  kago.erase(id, function(err) {
    if (err) {
      warn(err);
      return;
    }
    info('Deleted: ' + id);
    showKeys(kago);
  });
}

function warn(mess) {
  $('#info').addClass('alert-error').removeClass('alert-success').text(mess);
}

function info(mess) {
  $('#info').addClass('alert-success').removeClass('alert-error').text(mess);
}