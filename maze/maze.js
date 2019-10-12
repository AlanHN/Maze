//ctx是一个2d画板类型
//grid和padding是一个小方块的边长
//maze是记录了迷宫信息的二维数组
//wid是迷宫的宽度，hei是迷宫的高度
//stack为已找路径
//density是石块密度

var ctx, wid, hei, cols, rows, maze, stack = [],
    start = {
        x: -1,
        y: -1
    },
    end = {
        x: -1,
        y: -1
    },
    grid = 8,
    padding = 16,
    s, density = 0.5;

//根据maze中的信息在ctx中绘图
function drawMaze() {
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            switch (maze[i][j]) {
                case 0:
                    ctx.fillStyle = "white"; //0，【可走路径】【白色】
                    break;
                case 1:
                    ctx.fillStyle = "black"; //1，【障碍路径】【黑色】
                    break;
                case 2:
                    ctx.fillStyle = "red"; //2，【探索路径】【红色】
                    break;
                case 3:
                    ctx.fillStyle = "yellow"; //3，【正确路径】【黄色】
                    break;
                case 4:
                    ctx.fillStyle = "#7C0000"; //4，【已走路径】【浅红色】
                    break;
            }
            ctx.fillRect(grid * i, grid * j, grid, grid);
        }
    }
}

//画砖头
function drawBlock(sx, sy, a) {
    switch (a) { //根据maze的信息在ctx中绘图
        case 0:
            ctx.fillStyle = "white"; //0，【可走路径】【白色】
            break;
        case 1:
            ctx.fillStyle = "black"; //1，【障碍路径】【黑色】
            break;
        case 2:
            ctx.fillStyle = "red"; //2，【探索路径】【红色】
            break;
        case 3:
            ctx.fillStyle = "yellow"; //3，【正确路径】【黄色】
            break;
        case 4:
            ctx.fillStyle = "#7C0000"; //4，【已走路径】【浅红色】
            break;
    }
    ctx.fillRect(grid * sx, grid * sy, grid, grid);
}

//给solveMaze使用，在sx和sy附近搜索值为a（0-4）的maze，有就压进n
function getFNeighbours(sx, sy, a) {
    var n = [];
    dx = start.x - end.x;
    dy = start.y - end.y;
    //如果终点在现在位置的右边
    if (dx <= 0) {
        //向右搜寻
        if (sx + 1 < cols - 1 && maze[sx + 1][sy] == a) {
            n.push({
                x: sx + 1,
                y: sy
            });
        }
        //如果终点在现在位置的上边
        if (dy >= 0) {
            //向上搜寻
            if (sy - 1 > 0 && maze[sx][sy - 1] == a) {
                n.push({
                    x: sx,
                    y: sy - 1
                });
            }
            //向下搜寻
            if (sy + 1 < rows - 1 && maze[sx][sy + 1] == a) {
                n.push({
                    x: sx,
                    y: sy + 1
                });
            }
        } else {
            //向下搜寻
            if (sy + 1 < rows - 1 && maze[sx][sy + 1] == a) {
                n.push({
                    x: sx,
                    y: sy + 1
                });
            }
            //向上搜寻
            if (sy - 1 > 0 && maze[sx][sy - 1] == a) {
                n.push({
                    x: sx,
                    y: sy - 1
                });
            }
        }
        //向左搜寻
        if (sx - 1 > 0 && maze[sx - 1][sy] == a) {
            n.push({
                x: sx - 1,
                y: sy
            });
        }
    }
    //如果终点在现在位置的左边
    else {
        //向左搜寻
        if (sx - 1 > 0 && maze[sx - 1][sy] == a) {
            n.push({
                x: sx - 1,
                y: sy
            });
        }
        //如果终点在现在位置的上边
        if (dy >= 0) {
            //向上搜寻
            if (sy - 1 > 0 && maze[sx][sy - 1] == a) {
                n.push({
                    x: sx,
                    y: sy - 1
                });
            }
            //向下搜寻
            if (sy + 1 < rows - 1 && maze[sx][sy + 1] == a) {
                n.push({
                    x: sx,
                    y: sy + 1
                });
            }
        } else {
            //向下搜寻
            if (sy + 1 < rows - 1 && maze[sx][sy + 1] == a) {
                n.push({
                    x: sx,
                    y: sy + 1
                });
            }
            //向上搜寻
            if (sy - 1 > 0 && maze[sx][sy - 1] == a) {
                n.push({
                    x: sx,
                    y: sy - 1
                });
            }
        }
        //向右搜寻
        if (sx + 1 < cols - 1 && maze[sx + 1][sy] == a) {
            n.push({
                x: sx + 1,
                y: sy
            });
        }
    }
    return n;
}

//走迷宫
function solveMaze1() {
    //终止条件
    if (start.x == end.x && start.y == end.y) {
        for (var i = 0; i < cols; i++) {
            for (var j = 0; j < rows; j++) {
                switch (maze[i][j]) {
                    case 2:
                        maze[i][j] = 3;
                        break; //把探索路径改为正确路径
                    case 4:
                        maze[i][j] = 0;
                        break; //把已走路径改为可走路径
                }
            }
        }
        drawMaze();
        return;
    }
    var neighbours = getFNeighbours(start.x, start.y, 0);
    //若在附近找到有路
    if (neighbours.length) {
        stack.push(start); //压入当前点
        start = neighbours[0]; //将某个方向赋给start
        maze[start.x][start.y] = 2; //改为探索路径
        //若在附近找不到路
    } else {
        maze[start.x][start.y] = 4; //改为已走路径
        start = stack.pop(); //舍弃当前点
    }

    drawMaze();
    requestAnimationFrame(solveMaze1); //使用动画
}

//得到鼠标位置
function getCursorPos(event) {
    var rect = this.getBoundingClientRect();
    var x = Math.floor((event.clientX - rect.left) / grid / s),
        y = Math.floor((event.clientY - rect.top) / grid / s);
    //没点到可走路径，就返回
    if (maze[x][y]) return;
    //如果start还没赋值，赋值start
    if (start.x == -1) {
        start = {
            x: x,
            y: y
        };
    }
    //start已经赋值，赋值end
    else {
        end = {
            x: x,
            y: y
        };
        maze[start.x][start.y] = 2;
        solveMaze1();
    }
}

//一次探测两格，是为了刚好能够形成宽为1格的，连通的迷宫，给createMaze用
function getNeighbours(sx, sy, a) {
    var n = []; //定义一个空的数组
    if (sx - 1 > 0 && maze[sx - 1][sy] == a && sx - 2 > 0 && maze[sx - 2][sy] == a) {
        n.push({
            x: sx - 1,
            y: sy
        });
        n.push({
            x: sx - 2,
            y: sy
        });
    }
    if (sx + 1 < cols - 1 && maze[sx + 1][sy] == a && sx + 2 < cols - 1 && maze[sx + 2][sy] == a) {
        n.push({
            x: sx + 1,
            y: sy
        });
        n.push({
            x: sx + 2,
            y: sy
        });
    }
    if (sy - 1 > 0 && maze[sx][sy - 1] == a && sy - 2 > 0 && maze[sx][sy - 2] == a) {
        n.push({
            x: sx,
            y: sy - 1
        });
        n.push({
            x: sx,
            y: sy - 2
        });
    }
    if (sy + 1 < rows - 1 && maze[sx][sy + 1] == a && sy + 2 < rows - 1 && maze[sx][sy + 2] == a) {
        n.push({
            x: sx,
            y: sy + 1
        });
        n.push({
            x: sx,
            y: sy + 2
        });
    }
    return n;
}


//返回一个长为col，宽为row的二维数组m，
function createArray(cols, rows) {
    var m = new Array(cols);
    for (var i = 0; i < cols; i++) {
        m[i] = new Array(rows);
        for (var j = 0; j < rows; j++) {
            m[i][j] = 1; //把所有的都初始化为1，一开始都是【墙】
        }
    }
    return m;
}

//创建迷宫，并调用绘制函数
function createMaze1() {
    var neighbours = getNeighbours(start.x, start.y, 1),
        l; //寻找start周围的墙
    //旁边已经不能画路了，开始接受鼠标事件
    if (neighbours.length < 1) {
        if (stack.length < 1) {
            drawMaze();
            stack = [];
            start.x = start.y = -1;
            //addEventListener(事件名称, 调用函数,冒泡/捕获阶段执行[这里false是冒泡阶段执行])
            document.getElementById("canvas").addEventListener("mousedown", getCursorPos, false);
            document.getElementById("btnCreateMaze").removeAttribute("disabled");

            return;
        }
        start = stack.pop(); //以上一次终点为起点  
    }
    //旁边还能画路
    else {
        var i = 2 * Math.floor(Math.random() * (neighbours.length / 2))
        l = neighbours[i];
        maze[l.x][l.y] = 0;

        l = neighbours[i + 1];
        maze[l.x][l.y] = 0;

        start = l
        stack.push(start)
    }
    drawMaze();
    requestAnimationFrame(createMaze1);
}

//无动画形式生成maze1
function createMaze1NonAni() {
    while (true) {
        var neighbours = getNeighbours(start.x, start.y, 1),
            l;
        if (neighbours.length < 1) {
            if (stack.length < 1) {
                drawMaze();
                stack = [];
                start.x = start.y = -1;
                document.getElementById("canvas").addEventListener("mousedown", getCursorPos, false);
                document.getElementById("btnCreateMaze").removeAttribute("disabled");
                return;
            }
            start = stack.pop();
        } else {
            var i = 2 * Math.floor(Math.random() * (neighbours.length / 2))
            l = neighbours[i];
            maze[l.x][l.y] = 0;

            l = neighbours[i + 1];
            maze[l.x][l.y] = 0;

            start = l
            stack.push(start)
        }
    }
    document.getElementById("btnCreateMaze").removeAttribute("disabled");
}

function createMaze2() {

    var r = Math.random();
    
    maze[start.x][start.y] = r < density ? 0 : 1;

    drawBlock(start.x, start.y, maze[start.x][start.y]);

    if (start.x == (cols - 1) && start.y == (rows - 1)) {

        document.getElementById("btnCreateMaze").removeAttribute("disabled");
        return;
    }

    start.x = start.x + 1;
    if (start.x == cols) {
        start.x = 0;
        start.y = start.y + 1;
    }

    requestAnimationFrame(createMaze2);
}

function createMaze2NonAni() {
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            maze[i][j] = Math.random() < density ? 0 : 1;

            drawBlock(i, j, maze[i][j]);
        }
    }
    document.getElementById("btnCreateMaze").removeAttribute("disabled");
}

//创建一个画布，用来在上面画迷宫
function createCanvas() {
    var canvas = document.createElement("canvas");
    wid = document.getElementById("maze").offsetWidth - padding;
    hei = 400;

    canvas.width = wid;
    canvas.height = 400;
    canvas.id = "canvas";
    ctx = canvas.getContext("2d");
    ctx.fillStyle = "gray";
    ctx.fillRect(0, 0, wid, hei);
    var div = document.getElementById("maze")
    div.appendChild(canvas);
}

//初始化界面
function init() {
    createCanvas();
}

function onCreate() {

    document.getElementById("chkAnimated").setAttribute("disabled","disabled");
    document.getElementById("sltType").setAttribute("disabled","disabled");
    document.getElementById("cols").setAttribute("disabled","disabled");
    document.getElementById("rows").setAttribute("disabled","disabled");
    document.getElementById("density").setAttribute("disabled","disabled");
    document.getElementById("btnCreateMaze").setAttribute("disabled", "disabled");

    wid = document.getElementById("maze").offsetWidth - padding;
    hei = 400;

    cols = eval(document.getElementById("cols").value);
    rows = eval(document.getElementById("rows").value);

    var mazeType = document.getElementById("sltType").value;

    if (mazeType == "Maze1") {
        cols = cols + 1 - cols % 2;
        rows = rows + 1 - rows % 2;    
    }

    maze = createArray(cols, rows);

    var canvas = document.getElementById("canvas");
    canvas.width = wid;
    canvas.height = hei;
    s = canvas.width / (grid * cols);
    canvas.height = s * grid * rows;

    ctx.scale(s, s);


    if (mazeType == "Maze1") {

        start.x = Math.floor(Math.random() * (cols / 2));
        start.y = Math.floor(Math.random() * (rows / 2));
        if (!(start.x & 1)) start.x++;
        if (!(start.y & 1)) start.y++;
        maze[start.x][start.y] = 0;

        if (document.getElementById("chkAnimated").checked) {

            createMaze1();
        } else {

            createMaze1NonAni();
        }
    } else {
        density = eval(document.getElementById("density").value)/100;
        start.x = 0;
        start.y = 0;

        if (document.getElementById("chkAnimated").checked) {

            createMaze2();
        } else {

            createMaze2NonAni();
        }
    }
}
function maze2chosen()
{
    document.getElementById("density").setAttribute("disabled","disabled");
}
