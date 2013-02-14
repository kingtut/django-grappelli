var ImageInsert = {
    
    // base_url: '/filebrowser_ext/',
    // directory: null,

    pre_init: function() {
        tinyMCEPopup.requireLangPack();
    },
    
    init: function(ed) { 
        var self = this;
        
        this.breadcrumb = $('#breadcrumb');
        this.browser = $('#browser');
        this.folders = $('#folders');
        this.loading = $('<div id="loading"><div>Loading...</div></div>');
        
        this.folders.add(this.breadcrumb).on('click', 'a', function(e) {
            self.browser.children().remove();
            self.loading_state();
            
            var directory = $(this).data('dir');
            self.get_folder_list(directory);
            self.get_image_list(directory);
            return e.preventDefault();
        });
        
        this.browser.on('click', 'img', function(e) {
            $(this).toggleClass('selected');
        });
        
        this.loading_state();
        this.get_image_list();
        this.get_folder_list();
    },
    
    loading_state: function() {
        this.browser.append(this.loading);
        this.loading.children('div').css('padding-top', $(document).height() / 2);
    },
    
    build_url: function(type, directory) {
        var url = '/filebrowser_ext/filelist/?type=' + type;
        if (typeof directory != 'undefined') {
            url += '&dir=' + encodeURIComponent(directory);
        }
        return url;
    },
    
    get_image_list: function(directory, page) {
        var url = this.build_url('image', directory);
        this.browser.load(url);
    },
    
    get_folder_list: function(directory) {
        var url = this.build_url('folder', directory);
        var self = this;
        this.folders.load(url, function(e) {
            self.build_breadcrumb(directory);
        });
    },
    
    select_all: function() {
        this.browser.find('img').addClass('selected');
    },
    
    insert: function() {
        var image_sizes = tinymce.settings.imageinsert_image_sizes || [300, 400, 600];
        var ed = tinyMCEPopup.editor;
        
        // Fixes crash in Safari
		if (tinymce.isWebKit)
			ed.getWin().focus();
			
        var size_index = parseInt($('.image-size input:checked').val(), 10);
        var image_size = image_sizes[size_index];
        
        this.browser.find('img.selected').each(function(i, e) {
            var el = $(e);
            var dim = el.data('dim');
            var new_dim = [image_size, image_size];
            var ratio = parseFloat(dim[0]) / parseFloat(dim[1]);
            
            if (dim[0] > dim[1]) { // Landscape
                new_dim[0] = parseInt(parseFloat(image_size) * ratio, 10);
                
            } else if (dim[0] < dim[1]) { // Portrait
                new_dim[1] = parseInt(parseFloat(image_size) / ratio, 10);
            }
            
            var args = {
                'src': el.data('path'),
                'width': new_dim[0],
                'height': new_dim[1]
            };
            
            ed.execCommand('mceInsertContent', false, tinyMCEPopup.editor.dom.createHTML('img', args), {skip_undo: 1});
        });
		
		ed.undoManager.add();
		
		ed.execCommand('mceRepaint');
		ed.focus();
		tinyMCEPopup.close();
    },
    
    open_filebrowser: function() {
        tinyMCE.activeEditor.windowManager.open({
            file: '/admin/filebrowser/browse/?pop=2',
            width: 980,  // Your dimensions may differ - toy around with them!
            height: 500,
            resizable: 'yes',
            scrollbars: 'yes',
            inline: 'no',  // This parameter only has an effect if you use the inlinepopups plugin!
            close_previous: 'no'
        });
    },
    
    build_breadcrumb: function(directory) {        
        var crumb = $('<ul></ul>');
        crumb.append($('<li><a href="#" data-dir="/">Home</a></li>'));
        
        if (directory) {
            var parts = directory.split('/');

            if (parts.length) {
                var build = "";
                for (var i=0; i < parts.length; i++) {
                    if (!parts[i]) { continue; } 
                    build += "/" + parts[i];
                    crumb.append($('<li><a href="#" data-dir="' + build + '">' + parts[i] + '</a></li>'));
                };
            }
        }

        this.breadcrumb.children().remove();
        this.breadcrumb.append(crumb);
    }
};

ImageInsert.pre_init();
tinyMCEPopup.onInit.add(ImageInsert.init, ImageInsert);