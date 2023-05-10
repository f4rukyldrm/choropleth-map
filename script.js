const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json';

const countyURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json';
const educationURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json';

let countyData;
let educationData;

let canvas = d3.select('#canvas');
let tooltip = d3.select('#tooltip');

const drawMap = () => {

    canvas.selectAll('path')
        .data(countyData)
        .enter()
        .append('path')
        .attr('d', d3.geoPath())
        .attr('class', 'county')
        .attr('fill', item => {
            let id = item['id'];
            let county = educationData.find(item => item['fips'] === id);

            let percentage = county['bachelorsOrHigher'];

            if (percentage <= 15) {
                return 'rgb(229, 245, 224)';
            } else if (percentage <= 30) {
                return 'rgb(161, 217, 155)';
            } else if (percentage <= 45) {
                return 'rgb(65, 171, 93)';
            } else {
                return 'rgb(0, 109, 44)';
            }
        })
        .attr('data-fips', item => item['id'])
        .attr('data-education', item => {
            let id = item['id'];
            let county = educationData.find(item => item['fips'] === id);

            return county['bachelorsOrHigher'];
        })
        .on('mouseover', item => {
            tooltip.transition()
                .style('visibility', 'visible');

            let id = item['id'];
            let county = educationData.find(item => item['fips'] === id);


            tooltip.text(county['area_name'] + ', ' + county['state'] + ' : ' + county['bachelorsOrHigher'] + '%')

            tooltip.attr('data-education', county['bachelorsOrHigher']);

        })
        .on('mouseout', item => {
            tooltip.transition()
                .style('visibility', 'hidden');
        })


}

d3.json(countyURL)
    .then((data, error) => {
        if (error) {
            console.log(error);
        } else {
            countyData = topojson.feature(data, data.objects.counties).features;

            d3.json(educationURL)
                .then((data, error) => {
                    if (error) {
                        console.log(error);
                    } else {
                        educationData = data;

                        drawMap()
                    }
                })
        }
    });
