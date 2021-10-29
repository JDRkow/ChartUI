import React, { useEffect, useState } from 'react';
import Chart from './Chart';
import axios from 'axios';

export default function Home() {


    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [{
            label: '',
            data: []
        }]
    });

    const [selectedFile, setSelectedFile] = useState();

    const [isChartData, setIsChartData] = useState('');

    useEffect(() => {
        axios.get(`http://localhost:5000/chart`).then(res => {
            if (res.data) {
                setChartData({
                    labels: res.data.map(area => area.nameArea),
                    datasets: [{
                        label: 'Значение',
                        data: res.data.map(area => area.areaParameter),
                    }]
                });
                setIsChartData(true);
            }
        }
        );
    }, [isChartData]);



    const onFileChange = event => {
        setSelectedFile(event.target.files[0]);
    };

    const onFileUpload = () => {
        const formData = new FormData();

        formData.append(
            "uploadTable",
            selectedFile,
        );

        axios({
            method: "post",
            url: "http://localhost:5000/chart",
            data: formData,
            headers: { "Content-Type": "multipart/form-data" },
        })
            .then(function (response) {
                setIsChartData(false);
            })
            .catch(function (response) {
                console.log(response);
            });
    };

    if (isChartData) {
        return (
            <div>
                <div>
                    <input type="file" onChange={onFileChange} />
                    <button onClick={onFileUpload}>
                        Загрузить
                    </button>
                </div>
                <Chart chartData={chartData} legendPosition="bottom" />
            </div>
        )
    }
    else {
        return (
            <div>
                <div>
                    <input type="file" onChange={onFileChange} />
                    <button onClick={onFileUpload}>
                        Upload!
                    </button>
                </div>
            </div>
        )
    }
}