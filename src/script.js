software = {
    
    get_list : function(func){
        
        if(func !== undefined)
        airscarp.plugin.shell.run_script("scripts/list.sh", func);
    },
    
    show_table : function(output){
            
        if(!output.s){
            return false;
            airscarp.error("Something went wrong!");
        }
        
        var data = output.output;
        data = data.split("\n");
        
        // Dpkg
        if(data[0] == "dpkg-list"){
            
            // Parse
            var parsed = software.dpkg.parse(data);
            
            // Show table
            software.dpkg.show_table(parsed);
        }
    },
    
    dpkg : {
        
        parse : function(data){
            
            console.log(data);
            
            var table      = [];
            var header_end = false;
            var line, parsed;
            
            for(var i = 0; i < data.length; i++){
                
                if(!header_end){
                    
                    if(data[i].startsWith("+++-=")) header_end = true;
                }
                
                else{
                    parsed = data[i].replace(/ +/g, ' ').split(" ");
                    if(parsed[1] === undefined) continue;
                    line = [
                        parsed[1],
                        parsed[2],
                        parsed[3],
                        parsed.splice(4).join(" "),
                    ];
                    
                    table.push(line);
                }
            }
            
            return table;
        },
        
        show_table : function(parsed){
            
            var table = [
                '<table class="table table-hover">',
                    '<thead>',
                        '<tr>',
                            '<th class="header">Name</th>',
                            '<th class="header">Version</th>',
                            '<th class="header">Architecture</th>',
                            '<th class="header">Description</th>',
                            '<th class="header"></th>',
                        '</tr>',
                    '</thead>',
                    '<tbody>',
            ];
            
            for(var i = 0; i < parsed.length; i++){
                
                table.push([
                    '<tr>',
                        '<td>' + parsed[i][0] + '</td>',
                        '<td>' + parsed[i][1] + '</td>',
                        '<td>' + parsed[i][2] + '</td>',
                        '<td>' + parsed[i][3] + '</td>',
                        '<td><a href="#" data-uninstall="' + parsed[i][0] + '"><i class="fas fa-trash" data-toggle="tooltip" data-placement="left" title="Uninstall"></i></a></td>',
                    '</tr>',
                ].join(""));
            }
            
            table.push('</tbody>');
            table.push('</table>');
            
            $("#programs-table-cont").html(table.join(""));
        },
    },
    
    listener : {
        
        uninstall : function(){
            
            $(document).on("click", "[data-uninstall]", function(e){
                
                e.preventDefault();
                
                if(confirm("Are you sure?")){
                    
                    // Loading icon
                    $(this).html('<i class="fas fa-circle-notch fa-spin"></i>');
                    var name = $(this).attr("data-uninstall");
                    if(name === undefined){
                        airscarp.error("A program with this name could not be found.");
                        return false;
                    }
                    
                    airscarp.plugin.shell.exec("sudo dpkg --purge --force-all " + name, function(){
                        
                        // Success toast
                        airscarp.success("Uninstalled Software!");
                    });
                }
                
                else{
                    // Cancelled toast
                    airscarp.error("Cancelled.");
                }
            });
        },
    },
};

software.listener.uninstall();