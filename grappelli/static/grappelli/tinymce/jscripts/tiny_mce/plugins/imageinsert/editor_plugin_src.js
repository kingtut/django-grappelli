(function() {
        // Load plugin specific language pack
        tinymce.PluginManager.requireLangPack('en.imageinsert_dlg');

        tinymce.create('tinymce.plugins.ImageInsert', {
                /**
                 * Initializes the plugin, this will be executed after the plugin has been created.
                 * This call is done before the editor instance has finished it's initialization so use the onInit event
                 * of the editor instance to intercept that event.
                 *
                 * @param {tinymce.Editor} ed Editor instance that the plugin is initialized in.
                 * @param {string} url Absolute URL to where the plugin is located.
                 */
                init : function(ed, url) {
                        // Register the command so that it can be invoked by using tinyMCE.activeEditor.execCommand('mceExample');
                        ed.addCommand('mceImageInsert', function() {
                                ed.windowManager.open({
                                        file: url + '/dialog.html',
                                        width: 700 + parseInt(ed.getLang('imageinsert.delta_width', 0), 10),
                    					height: 550 + parseInt(ed.getLang('imageinsert.delta_height', 0), 10),
                                        inline: 1
                                }, {
                                        plugin_url: url, // Plugin absolute URL
                                        some_custom_arg: 'custom arg' // Custom argument
                                });
                        });

                        // Register example button
                        ed.addButton('imageinsert', {
                                title : 'imageinsert.image_desc',
                                cmd : 'mceImageInsert'
                                //image : url + '/img/example.gif'
                        });

                        // Add a node change handler, selects the button in the UI when a image is selected
                        // ed.onNodeChange.add(function(ed, cm, n) {
                        //         cm.setActive('example', n.nodeName == 'IMG');
                        // });
                },

                /**
                 * Returns information about the plugin as a name/value array.
                 * The current keys are longname, author, authorurl, infourl and version.
                 *
                 * @return {Object} Name/value array containing information about the plugin.
                 */
                getInfo : function() {
                        return {
                                longname : 'Multiple Image Insert plugin',
                                author : 'Adrian Elford',
                                authorurl : 'http://example.com',
                                infourl : 'http://example.com',
                                version : "1.0"
                        };
                }
        });

        // Register plugin
        tinymce.PluginManager.add('imageinsert', tinymce.plugins.ImageInsert);
})();