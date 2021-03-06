var sidebar = {
    myFillColor: styleData.sidebarBG,
    myGlobalAlpha: 1,
    width: 256,
    scrollTop: 0,
    imageSources: [],
    
    categories: { },
    
    AddToSidebar: function(node, name, cat, image, imgX, imgY)
    {
        if(this.categories[cat] === undefined)
        {
            this.categories[cat] = {
                state: "closed",
                hovering: false,
                hoverTimer: 0,
                openinterp: 0,
                myTop: 0,
                nodes: []
            };
        }
        
        if(image !== undefined)
        {
            var bFound = false;
            for(var i = 0; i < this.imageSources.length; i++)
            {
                if(this.imageSources[i].name == image)
                {
                    bFound = true;
                    image = this.imageSources[i].data;
                    break;
                }
            }
        
            if(!bFound)
            {
                var imgDat = new Image();
                imgDat.src = "images/" + image + ".png";
                this.imageSources.push({name: image, data: imgDat});
                image = imgDat;
            }
        }
        
        this.categories[cat].nodes.push({
            node: node,
            name: name,
            hovering: false,
            hoverTimer: 0,
            img: image,
            imgX: imgX,
            imgY: imgY,
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
                   virtualMousePosition.y > this.categories[cat].myTop + 18 + Math.floor(i / 3) * 96 &&
                   virtualMousePosition.y < this.categories[cat].myTop + 18 + (Math.floor(i / 3) + 1) * 96 &&
                   virtualMousePosition.x > left + 4 + (86 * (i % 3)) &&
                   virtualMousePosition.x < left + 84 + (86 * (i % 3)))
                {
                    var newEl = new window[this.categories[cat].nodes[i].node]();
                    _workspace.push(newEl);
                    ctrlDownOnDrag = true;
                    selectedEl = undefined;
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
        
        var newCat = undefined;
        for(var cat in this.categories)
        {
            if(virtualMousePosition.y > this.categories[cat].myTop && virtualMousePosition.y < this.categories[cat].myTop + 18)
            {
                this.categories[cat].state = this.categories[cat].state == "closed" ? this.categories[cat].state = "open" : this.categories[cat].state = "closed";
                newCat = cat;
                break;
            }
        }
        
        for(var cat in this.categories)
        {
            if(cat == newCat)
                continue;
            
            this.categories[cat].state =  "closed";
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
                   virtualMousePosition.y > this.categories[cat].myTop + 18 + Math.floor(i / 3) * 96 &&
                   virtualMousePosition.y < this.categories[cat].myTop + 18 + (Math.floor(i / 3) + 1) * 96 &&
                   virtualMousePosition.x > left + 4 + (86 * (i % 3)) &&
                   virtualMousePosition.x < left + 84 + (86 * (i % 3)))
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
        
        var nextY = 0;
        ctx.translate(0, -this.scrollTop);
        for(var cat in this.categories)
        {
            var thisCatHeight = 24;
            this.categories[cat].myTop = nextY;
            
            ctx.fillStyle = ColorLighten("rgba(26, 26, 26, 0.8)", Lerp(0, 0.2, this.categories[cat].hoverTimer));
            ctx.fillRect(left, nextY, this.width, 18);
            
            ctx.fillStyle = "#FFFFFF";
            ctx.font = "10pt Trebuchet MS";
            ctx.fillText(cat.substr(0, 1).toUpperCase() + cat.substr(1), left + 4, nextY + 12);
            
            if(this.categories[cat].openinterp > 0.001)
            {
                thisCatHeight += (Math.ceil(this.categories[cat].nodes.length / 3) * 96) * this.categories[cat].openinterp;
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
                        DrawRoundedRectangle(left + 4 + ctx.lineWidth + (86 * (i % 3)), nextY + 18 + ctx.lineWidth + 96 * Math.floor(i / 3), 80 - ctx.lineWidth * 2, 96 - ctx.lineWidth * 2, 4);
                        ctx.closePath();
                        ctx.fill();
                        ctx.stroke();
                        ctx.lineWidth = 1;
                    }
                    
                    ctx.fillStyle = "#FFFFFF";
                    if(this.categories[cat].nodes[i].img !== undefined)
                    {                        
                        ctx.drawImage(this.categories[cat].nodes[i].img, this.categories[cat].nodes[i].imgX, this.categories[cat].nodes[i].imgY, 64, 64, left + 12 + (86 * (i % 3)), nextY + 24 + 96 * Math.floor(i / 3), 64, 64);
                    }
                    else
                    {
                        ctx.fillRect(left + 12 + (86 * (i % 3)), nextY + 24 + 96 * Math.floor(i / 3), 64, 64);
                    }
                    
                    ctx.font = "6pt Trebuchet MS";
                    ctx.fillText(this.categories[cat].nodes[i].name, left + 44 + (86 * (i % 3)) - ctx.measureText(this.categories[cat].nodes[i].name).width / 2, nextY + 104 + 96 * Math.floor(i / 3));
                }
                
                ctx.restore();
            }
            
            nextY += thisCatHeight;
        }
        
        //this.scrollTop += 0.01;
        ctx.globalAlpha = 1;
    }
};