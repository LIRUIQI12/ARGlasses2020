import React from 'react';
import {getLandmarks, loadModels} from '../faceapi'
import {faces, rims, lins, rimsCenter, strings} from '../resource'
import {Col, Row, Card, Form} from 'react-bootstrap';
import InputRange from 'react-input-range'
import 'react-input-range/lib/css/index.css'


function drawGlasses(state) {
    if (!(state.isRimLoaded || state.isLinsLoaded) || state.fullDesc == null)
        return
    let i
    let canvas = state.canvas
    let ctx = canvas.getContext('2d')
    ctx.fillStyle = "#FF0000";
    ctx.strokeStyle = "#FF0000";
    
    let fullDesc = state.fullDesc
    let faceImg = state.face


    // real size in pixels
    // var clientWidth = ctx.canvas.clientWidth;
    // var clientHeight = ctx.canvas.clientHeight;

    //canvas coords
    var wCanvas = ctx.canvas.width;
    var hCanvas = ctx.canvas.height;

    const wFace = faceImg.width;
    const hFace = faceImg.height;

    let kx = wCanvas / wFace;
    let ky = hCanvas / hFace;

    let kImg = (kx) < (ky) ? (kx) : (ky);


    clearInterval(state.glassesInervalId)
    const positions = fullDesc[0].landmarks._positions;

    let rim = state.rim;
    let lins = state.lins;

    let leftPoint = positions[36];
    let rightPoint = positions[45];

    let angle = Math.atan((rightPoint._y - leftPoint._y) / (rightPoint._x - leftPoint._x))

    let centerX = (leftPoint._x + rightPoint._x) / 2
    let centerY = (leftPoint._y + rightPoint._y) / 2

    const wGlassesImg = rim.width;
    const hGlassesImg = rim.height;

    let wGlasses = positions[16]._x - positions[0]._x;
    let hGlasses = hGlassesImg * wGlasses / wGlassesImg

    let x = (centerX * kImg - wGlasses / 2 * kImg)
    let imgCenter = rimsCenter[state.glassesNumber];
    let y = (centerY * kImg - hGlasses * imgCenter * kImg )

    ctx.translate(x, y)
    ctx.rotate(angle)
    ctx.drawImage(rim, 0, 0, wGlasses * kImg, hGlasses * kImg)
    ctx.globalAlpha = state.minAlpha + state.curAlpha / (state.maxAlpha - state.minAlpha);
    ctx.drawImage(lins, 0, 0, wGlasses * kImg, hGlasses * kImg)
    ctx.globalAlpha = 1;

    /** ----- */
    
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(wGlasses * kImg, 0);
    ctx.lineTo(wGlasses * kImg, 0 + hGlasses * kImg);
    ctx.lineTo(0, 0 + hGlasses * kImg);
    ctx.lineTo(0, 0);
    ctx.stroke();
    /** ----- */

    ctx.rotate(-angle)
    ctx.translate(-x, -y)

    ctx.beginPath();
    ctx.moveTo(leftPoint._x* kImg, leftPoint._y * kImg);
    ctx.lineTo(rightPoint._x * kImg, rightPoint._y * kImg);
    ctx.stroke();
        
}


function drawFace(state) {
    let i
    let canvas = state.canvas
    let ctx = canvas.getContext('2d')
    ctx.fillStyle = "#FF0000";
    ctx.strokeStyle = "#FF0000";
    
    let fullDesc = state.fullDesc
    let faceImg = state.face


    // real size in pixels
    // var clientWidth = ctx.canvas.clientWidth;
    // var clientHeight = ctx.canvas.clientHeight;

    //canvas coords
    var wCanvas = ctx.canvas.width;
    var hCanvas = ctx.canvas.height;

    const wFace = faceImg.width;
    const hFace = faceImg.height;

    let kx = wCanvas / wFace;
    let ky = hCanvas / hFace;

    let kImg = (kx) < (ky) ? (kx) : (ky);

    ctx.drawImage(faceImg, 0, 0, wFace * kImg, hFace * kImg);

    if (state.fullDesc != null) {
        clearInterval(state.onTimeId)

        const positions = fullDesc[0].landmarks._positions;
        // if (state.isGlassesLoad) {
        //     clearInterval(state.onGlassesId)
        //     let rim = state.rim;
        //     let lins = state.lins;

        //     let leftPoint = positions[36];
        //     let rightPoint = positions[45];

        //     let angle = Math.atan((rightPoint._y - leftPoint._y) / (rightPoint._x - leftPoint._x))
        //     console.log('angle: ' + angle)
            

        //     let centerX = (leftPoint._x + rightPoint._x) / 2
        //     let centerY = (leftPoint._y + rightPoint._y) / 2

            

        //     const wGlassesImg = rim.width;
        //     const hGlassesImg = rim.height;

        //     let wGlasses = positions[16]._x - positions[0]._x;
        //     let hGlasses = hGlassesImg * wGlasses / wGlassesImg


        //     let x = (centerX * kImg - wGlasses / 2 * kImg)
        //     let imgCenter = rimsCenter[state.glassesNumber];
        //     let y = (centerY * kImg - hGlasses * imgCenter * kImg )

        //     ctx.translate(x, y)
        //     ctx.rotate(angle)
        //     ctx.drawImage(rim, 0, 0, wGlasses * kImg, hGlasses * kImg)
        //     ctx.globalAlpha = 0.5;
        //     ctx.drawImage(lins, 0, 0, wGlasses * kImg, hGlasses * kImg)
        //     ctx.globalAlpha = 1;

        //     /** ----- */
            
        //     ctx.beginPath();
        //     ctx.moveTo(0, 0);
        //     ctx.lineTo(wGlasses * kImg, 0);
        //     ctx.lineTo(wGlasses * kImg, 0 + hGlasses * kImg);
        //     ctx.lineTo(0, 0 + hGlasses * kImg);
        //     ctx.lineTo(0, 0);
        //     ctx.stroke();
        //     /** ----- */

        //     ctx.rotate(-angle)
        //     ctx.translate(-x, -y)

        //     ctx.beginPath();
        //     ctx.moveTo(leftPoint._x* kImg, leftPoint._y * kImg);
        //     ctx.lineTo(rightPoint._x * kImg, rightPoint._y * kImg);
        //     ctx.stroke();
            
        // }

        ctx.beginPath();
        for (i = 0; i < 17; i++)
        {
        const p = positions[i];
        if (i === 0)
            ctx.moveTo(p._x * kImg, p._y * kImg);
        else
            ctx.lineTo(p._x * kImg, p._y * kImg);
        }
        ctx.stroke();

        const indicesEyeLeft = [36, 37, 38, 39, 40, 41, 36];
        ctx.beginPath();
        for (i = 0; i < indicesEyeLeft.length; i++)
        {
        const p = positions[indicesEyeLeft[i]];
        if (i === 0)
            ctx.moveTo(p._x * kImg, p._y * kImg);
        else
            ctx.lineTo(p._x * kImg, p._y * kImg);
        }
        ctx.stroke();

        // draw eye right
        const indicesEyeRight = [42, 43, 44, 45, 46, 47, 42];
        ctx.beginPath();
        for (i = 0; i < indicesEyeRight.length; i++)
        {
        const p = positions[indicesEyeRight[i]];
        if (i === 0)
            ctx.moveTo(p._x * kImg, p._y * kImg);
        else
            ctx.lineTo(p._x * kImg, p._y * kImg);
        }
        ctx.stroke();
    }
}




class Canvas extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            isModelsLoaded: false,
            isGlassesLoad: false,
            fullDesc: null,
            onTimeId: null,
            canvas: null,
            isLinsLoaded: false,
            isRimLoaded: false, 
            curAlpha: 1,
            maxAlpha: 10,
            minAlpha: 0,
        }
    }

    onTime() {
        this.setState({
            onTimeId: null, 
            canvas: this.refs.canvas
        })
        drawFace(this.state)
    }

    async componentDidMount() {
        try {
            await loadModels();
            this.setState({isModelsLoaded: true})
            console.log("model loaded")
        } catch(err) {
            console.log(err)
        }
    }

    async onLoadFace() {
        try{
            let canvas = this.refs.canvas;
            canvas.width = canvas.getContext('2d').canvas.clientWidth;
            canvas.height = canvas.getContext('2d').canvas.clientHeight;
            const imgSrc = this.refs.face
            this.setState({imgH: imgSrc.height, imgW: imgSrc.width})
            this.setState({face: imgSrc})

            this.setState({
                onTimeId: null, 
                canvas: this.refs.canvas
            }, () => {
                drawFace(this.state)
            })
            //drawFace(this.state)
            // this.setState({
            //     onTimeId: setInterval(this.onTime.bind(this), 50)
            // })
            if (this.props.faceNumber != null
                && this.state.isModelsLoaded) {
                
                this.setState({fullDesc: await getLandmarks(imgSrc)}, () => {
                    drawFace(this.state)
                })
            }
            
        } catch (err) {
            console.log(err);
        }
    }

    async onLoadRim() {
        this.setState({isRimLoaded : true}, () => {
                this.setGlasses()
        });
        
    }

    async onLoadLins() {
        this.setState({isLinsLoaded : true});
    }

    async setGlasses() {
        this.setState({
            glassesNumber: this.props.glassesNumber,
            rim: this.refs.rim,
            lins: this.refs.lins,
            isGlassesLoad: true}, 
            () => {
                this.setState({
                    glassesInervalId: setInterval(() => drawGlasses(this.state))
                })
        })
    }

    render() {
        const styleImage = {
            display: 'none'
        };

        return (
            <Row fluid style={{height: '100%'}}>
                <Col style={{height: '100%'}}>
                    <Row style={{height: '10vh'}}>
                        <Form style={{width: '100%'}}>
                            <Form.Label>{strings['RU'].alpha}</Form.Label>
                            <InputRange 
                                        maxValue={this.state.maxAlpha}
                                        minValue={this.state.minAlpha}
                                        value={this.state.curAlpha}
                                        onChange={value => this.setState({
                                            curAlpha: value},
                                            () => {
                                                let canvas = this.state.canvas
                                                if (canvas == null)
                                                    return

                                                canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height)
                                                drawFace(this.state)
                                                drawGlasses(this.state)
                                            }
                                        )} />
                        </Form>
                    </Row>
                    <Row style={{height: '90vh'}}>
                        <img src={faces[this.props.faceNumber]} onLoad={this.onLoadFace.bind(this)} style={styleImage} ref='face' alt='face'/>
                        <img src={rims[this.props.glassesNumber]} onLoad={this.onLoadRim.bind(this)} style={styleImage} ref='rim' alt='glasses'/>
                        <img src={lins[this.props.glassesNumber]} onLoad={this.onLoadLins.bind(this)} style={styleImage} ref='lins' alt='glasses'/>
                        
                        <canvas style={{width:'100%',height:'100%'}} ref='canvas'/>
                    </Row>
                </Col>
            </Row>
        )
    }
}

export default Canvas