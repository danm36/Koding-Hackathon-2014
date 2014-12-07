var sidebar = {
    myFillColor: styleData.sidebarBG,
    myGlobalAlpha: 1,
    width: 256,
    scrollTop: 0,
    
    categories: { },
    
    AddToSidebar: function(node, name, cat)
    {
        if(this.categories[cat] === undefined)
            this.categories[cat] = {
                state: "closed",
                hovering: false,
                hoverTimer: 0,
                openinterp: 0,
                myTop: 0,
                nodes: []
            };
        
        this.categories[cat].nodes.push({
            node: node,
            name: name,
            hovering: false,
            hoverTimer: 0,
            img: undefined
        });
    },
    
    mouseDown: function(e)
    {
        var left = canvas.width - this.width;
        var virtualMousePosition = actualMousePosition.Copy();
        virtualMousePosition.y += this.scrollTop;
        
        for(var cat in this.categories)
        {   
            if(this.categories[cat].state != "open")
                continue;
            
            for(var i = 0; i < this.categories[cat].nodes.length; i++)
            {
                if(virtualMousePosition.x > left &&
                   virtualMousePosition.y > this.categories[cat].myTop + 18 + Math.floor(i / 2) * 96 &&
                   virtualMousePosition.y < this.categories[cat].myTop + 18 + (Math.floor(i / 2) + 1) * 96 &&
                   virtualMousePosition.x > left + 24 + (128 * (i % 2)) &&
                   virtualMousePosition.x < left + 104 + (128 * (i % 2)))
                {
                    var newEl = new window[this.categories[cat].nodes[i].node]();
                    _workspace.push(newEl);
                    ctrlDownOnDrag = true;
                    draggingEl = newEl;
                }
            } 
        }
    },
    
    mouseUp: function(e)
    {
        var left = canvas.width - this.width;
        var virtualMousePosition = actualMousePosition.Copy();
        virtualMousePosition.y += this.scrollTop;
        
        for(var cat in this.categories)
        {
            if(virtualMousePosition.y > this.categories[cat].myTop && virtualMousePosition.y < this.categories[cat].myTop + 18)
            {
                this.categories[cat].state = this.categories[cat].state == "closed" ? this.categories[cat].state = "open" : this.categories[cat].state = "closed";
                return;
            }
        }
    },
    
    mouseMove: function(e, newMousePos)
    {
    
    },
    
    UpdateSidebar: function()
    {       
        var left = canvas.width - this.width;
        
        var totalScrollableHeight = -canvas.height;
        var virtualMousePosition = actualMousePosition.Copy();
        virtualMousePosition.y += this.scrollTop;
        
        if(virtualMousePosition.x > left)
        {
            $("#canvas").removeClass("cursorHover");
            $("#canvas").removeClass("cursorDrag");
        }
        
        for(var cat in this.categories)
        {
            var thisCatHeight = 24 + (Math.ceil(this.categories[cat].nodes.length / 2) * 96) * this.categories[cat].openinterp;
            
            if(this.categories[cat].state == "open" && this.categories[cat].openinterp < 1)
                this.categories[cat].openinterp = Lerp(this.categories[cat].openinterp, 1, 0.2);
            else if(this.categories[cat].state == "closed" && this.categories[cat].openinterp > 0)
                this.categories[cat].openinterp = Lerp(this.categories[cat].openinterp, 0, 0.2);
            
            if(virtualMousePosition.x > left && virtualMousePosition.y > this.categories[cat].myTop && virtualMousePosition.y < this.categories[cat].myTop + 18)
            {
                this.categories[cat].hovering = true;
                $("#canvas").addClass("cursorHover");
            }
            else
                this.categories[cat].hovering = false;
            
            this.categories[cat].hoverTimer = Lerp(this.categories[cat].hoverTimer, this.categories[cat].hovering ? 1 : 0, 0.2);
                
            for(var i = 0; i < this.categories[cat].nodes.length; i++)
            {
                if(virtualMousePosition.x > left &&
                   virtualMousePosition.y > this.categories[cat].myTop + 18 + Math.floor(i / 2) * 96 &&
                   virtualMousePosition.y < this.categories[cat].myTop + 18 + (Math.floor(i / 2) + 1) * 96 &&
                   virtualMousePosition.x > left + 24 + (128 * (i % 2)) &&
                   virtualMousePosition.x < left + 104 + (128 * (i % 2)))
                {
                    this.categories[cat].nodes[i].hovering = true;  
                    $("#canvas").addClass("cursorHover");
                }
                else
                {
                    this.categories[cat].nodes[i].hovering = false;
                }
                
                this.categories[cat].nodes[i].hoverTimer = Lerp(this.categories[cat].nodes[i].hoverTimer, this.categories[cat].nodes[i].hovering ? 1 : 0, 0.2);
            }            
            
            totalScrollableHeight += thisCatHeight;
        }
        
        this.scrollTop = Math.max(Math.min(this.scrollTop, totalScrollableHeight), 0);
    },
    
    DrawSidebar: function()
    {
        var left = canvas.width - this.width;
        ctx.setTransform(1, 0, 0, 1, 0, 0); //Reset transformations back to the origin
        ctx.globalAlpha = this.myGlobalAlpha = Lerp(this.myGlobalAlpha, draggingEl !== undefined ? 0.2 : 1, 0.2);
        
        this.myFillColor = ColorLerp(this.myFillColor, SetOpacity(styleData.sidebarBG, draggingEl !== undefined ? 0.2 : 0.6), 0.2);
        ctx.fillStyle = this.myFillColor;
        ctx.fillRect(left, 0, this.width, canvas.height);
        
        ctx.font = "10pt Trebuchet MS";
        var nextY = 0;
        ctx.translate(0, -this.scrollTop);
        for(var cat in this.categories)
        {
            var thisCatHeight = 24;
            this.categories[cat].myTop = nextY;
            
            ctx.fillStyle = ColorLighten("rgba(26, 26, 26, 0.8)", Lerp(0, 0.2, this.categories[cat].hoverTimer));
            ctx.fillRect(left, nextY, this.width, 18);
            
            ctx.fillStyle = "#FFFFFF";
            ctx.fillText(cat.substr(0, 1).toUpperCase() + cat.substr(1), left + 4, nextY + 12);
            
            if(this.categories[cat].openinterp > 0.001)
            {
                thisCatHeight += (Math.ceil(this.categories[cat].nodes.length / 2) * 96) * this.categories[cat].openinterp;
                ctx.beginPath();
                
                ctx.rect(left, nextY, this.width, thisCatHeight);
                ctx.save();
                ctx.clip();
                
                for(var i = 0; i < this.categories[cat].nodes.length; i++)
                {
                    if(this.categories[cat].nodes[i].hoverTimer > 0.0001)
                    {
                        ctx.fillStyle = SetOpacity("#666666", this.categories[cat].nodes[i].hoverTimer);   
                        ctx.strokeStyle = SetOpacity("#777777", this.categories[cat].nodes[i].hoverTimer);  
                        ctx.lineWidth = 2;
                        ctx.beginPath();
                        DrawRoundedRectangle(left + 24 + ctx.lineWidth + (128 * (i % 2)), nextY + 18 + ctx.lineWidth + 96 * Math.floor(i / 2), 80 - ctx.lineWidth * 2, 96 - ctx.lineWidth * 2, 4);
                        ctx.closePath();
                        ctx.fill();
                        ctx.stroke();
                        ctx.lineWidth = 1;
                    }
                    
                    ctx.fillStyle = "#FFFFFF";
                    if(this.categories[cat].nodes[i].img !== undefined)
                    {
                        ctx.drawImage(this.categories[cat].nodes[i].img, left + 32 + (128 * (i % 2)), nextY + 24 + 96 * Math.floor(i / 2), 64, 64);
                    }
                    else
                    {
                        ctx.fillRect(left + 32 + (128 * (i % 2)), nextY + 24 + 96 * Math.floor(i / 2), 64, 64);
                    }
                    
                    ctx.fillText(this.categories[cat].nodes[i].name, left + 64 + (128 * (i % 2)) - ctx.measureText(this.categories[cat].nodes[i].name).width / 2, nextY + 104 + 96 * Math.floor(i / 2));
                }
                
                ctx.restore();
            }
            
            nextY += thisCatHeight;
        }
        
        //this.scrollTop += 0.01;
        ctx.globalAlpha = 1;
    }
};