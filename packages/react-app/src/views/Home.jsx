import { useContractReader } from "eth-hooks";
import { ethers } from "ethers";
import { React, useState} from "react";
import { Link } from "react-router-dom";
import { Col, Row, Divider, Typography, Avatar, Space, Button, Card, Image, Checkbox } from "antd";
import { FireTwoTone } from '@ant-design/icons';

const defaultCheckedList = [];

const { Title } = Typography;

/**
 * web3 props can be passed from '../App.jsx' into your local view component for use
 * @param {*} yourLocalBalance balance on current network
 * @param {*} readContracts contracts from current chain already pre-loaded using ethers contract module. More here https://docs.ethers.io/v5/api/contract/contract/
 * @returns react component
 **/
function Home({ yourLocalBalance, readContracts }) {
  // you can also use hooks locally in your component of choice
  // in this case, let's keep track of 'purpose' variable from our contract
  const purpose = useContractReader(readContracts, "YourContract", "purpose")

  const showthecard = true; // these variables would come from the contract... do we own any wood etc.?

  const [checkedList, setCheckedList] = useState(defaultCheckedList);

  const onChange = (checkedValues) => {
    console.log('checked = ', checkedValues);
    setCheckedList(checkedValues);
  };

  return (
    <>
      <Row style={{margin: 12}} gutter={[16, 16]}>
        <Col span={8}>
          
        <Space direction="vertical" size="middle" align="center">
          <Card
            hoverable
            style={{ width: 300, borderTopLeftRadius: "10px", borderTopRightRadius: "10px" }}
            bordered={true}
            bodyStyle={{ backgroundColor: "#787276" }}
            cover={<Image
              width={300}
              style={{ borderRadius: "10px" }}
              src="https://images.squarespace-cdn.com/content/v1/571079941bbee00fd7f0470f/1534799119980-PRY9DCBYV547AHYIOBSH/Iron+%284%29.JPG?format=2500w"
              preview={{
                src: 'https://images.squarespace-cdn.com/content/v1/571079941bbee00fd7f0470f/1534799119980-PRY9DCBYV547AHYIOBSH/Iron+%284%29.JPG?format=2500w',
              }}
            />}
          >
            <Row>
                <p style={{color: "white", fontFamily: "futura" }}>
                  <Button block size="medium" style={{margin: 2}}>Mint this</Button>
                  <Button block size="medium" style={{margin: 2}}>Trade for this</Button>  
                  Total Supply: 10
                </p>
              </Row>
          </Card>
        </Space>
          
        </Col>
        <Col span={8}>
        <Space direction="vertical" size="middle" align="center">
          <Card
            bordered={true}
            style={{ width: 300, borderTopLeftRadius: "10px", borderTopRightRadius: "10px" }}
            bodyStyle={{ backgroundColor: "#787276" }}
            cover={<Image
              width={300}
              style={{ borderRadius: "10px" }}
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Glassy_carbon_and_a_1cm3_graphite_cube_HP68-79.jpg/2880px-Glassy_carbon_and_a_1cm3_graphite_cube_HP68-79.jpg"
              preview={{
                src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Glassy_carbon_and_a_1cm3_graphite_cube_HP68-79.jpg/2880px-Glassy_carbon_and_a_1cm3_graphite_cube_HP68-79.jpg',
              }}
            />}
          >
            <Row>
              <p style={{color: "white", fontFamily: "futura" }}>
                  <Button block size="medium" style={{margin: 2}}>Mint this</Button>
                  <Button block size="medium" style={{margin: 2}}>Trade for this</Button>
                  Total Supply: 8
                </p>
              </Row>
          </Card>
        </Space>
        </Col>
        <Col span={8}>
        <Space direction="vertical" size="middle" align="center">
        <Card
            hoverable
            bordered={true}
            style={{ width: 300, borderTopLeftRadius: "10px", borderTopRightRadius: "10px" }}
            bodyStyle={{ backgroundColor: "#787276" }}
            cover={
              <Image
                width={300}
                style={{ borderRadius: "10px" }}
                src="https://upload.wikimedia.org/wikipedia/commons/7/76/Green_wood_visual_comparison.jpg"
                preview={{
                  src: 'https://upload.wikimedia.org/wikipedia/commons/7/76/Green_wood_visual_comparison.jpg',
                }}
              />
            }
          >
            <Row>
              <p style={{color: "white", fontFamily: "futura" }}>
                <Button block size="medium" style={{margin: 2}}>Mint this</Button>
                <Button block size="medium" style={{margin: 2}}>Trade for this</Button>
                Total Supply: 6
                </p>
              </Row>
          </Card>
        </Space>
        </Col>
      </Row>
      <Row>
        <Divider/>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          
          <Title level={4} style={{ color: "white", fontFamily: "futura" }}>Your NFTs</Title>
          <Title level={5} style={{ color: "white", fontFamily: "futura" }}>Select two or more to forge weaponry</Title>
          
          <Checkbox.Group onChange={onChange}>
          <Row gutter={[16, 16]}>
          
          <Space>
          <Col span={8}>
            <Card
              hoverable
              style={{ width: 200, borderTopLeftRadius: "10px", borderTopRightRadius: "10px" }}
              bordered={true}
              bodyStyle={{ backgroundColor: "#787276" }}
              cover={<Image
                width={200}
                style={{ borderRadius: "10px" }}
                src="https://images.squarespace-cdn.com/content/v1/571079941bbee00fd7f0470f/1534799119980-PRY9DCBYV547AHYIOBSH/Iron+%284%29.JPG?format=2500w"
                preview={{
                  src: 'https://images.squarespace-cdn.com/content/v1/571079941bbee00fd7f0470f/1534799119980-PRY9DCBYV547AHYIOBSH/Iron+%284%29.JPG?format=2500w',
                }}
              />}
            >
              <Row>
                  <p style={{color: "white", fontFamily: "futura" }}>
                    <Checkbox value="0" style={{color: "white", fontFamily: "futura"}}>Add Iron</Checkbox>
                  </p>
                </Row>
            </Card>
          </Col>
          <Col span={8}>
            {showthecard ?
            <Card
              hoverable
              style={{ width: 200, borderTopLeftRadius: "10px", borderTopRightRadius: "10px" }}
              bordered={true}
              bodyStyle={{ backgroundColor: "#787276" }}
              cover={<Image
                width={200}
                style={{ borderRadius: "10px" }}
                src="https://images.squarespace-cdn.com/content/v1/571079941bbee00fd7f0470f/1534799119980-PRY9DCBYV547AHYIOBSH/Iron+%284%29.JPG?format=2500w"
                preview={{
                  src: 'https://images.squarespace-cdn.com/content/v1/571079941bbee00fd7f0470f/1534799119980-PRY9DCBYV547AHYIOBSH/Iron+%284%29.JPG?format=2500w',
                }}
              />}
            >
              <Row>
                  <p style={{color: "white", fontFamily: "futura" }}>
                  <Checkbox value="1" style={{color: "white", fontFamily: "futura"}}>Add Carbon</Checkbox>
                  </p>
                </Row>
            </Card>
            : null}
          </Col>
          <Col span={8}>
            <Card
              hoverable
              style={{ width: 200, borderTopLeftRadius: "10px", borderTopRightRadius: "10px" }}
              bordered={true}
              bodyStyle={{ backgroundColor: "#787276" }}
              cover={<Image
                width={200}
                style={{ borderRadius: "10px" }}
                src="https://images.squarespace-cdn.com/content/v1/571079941bbee00fd7f0470f/1534799119980-PRY9DCBYV547AHYIOBSH/Iron+%284%29.JPG?format=2500w"
                preview={{
                  src: 'https://images.squarespace-cdn.com/content/v1/571079941bbee00fd7f0470f/1534799119980-PRY9DCBYV547AHYIOBSH/Iron+%284%29.JPG?format=2500w',
                }}
              />}
            >
              <Row>
                  <p style={{color: "white", fontFamily: "futura" }}>
                    <Checkbox value="2" style={{color: "white", fontFamily: "futura"}}>Add Wood</Checkbox>
                  </p>
                </Row>
            </Card>
          </Col>
          </Space>
          </Row>
          </Checkbox.Group>

          <Row style={{margin: 12}}>
            <Col span={10}></Col>
            <Col span={4}>
              {checkedList.length >= 2 ?
                <Button block size="large" shape="round" style={{fontFamily: "futura"}} icon={<FireTwoTone />}>Forge!</Button>
              : <Button block size="large" shape="round" style={{fontFamily: "futura"}} disabled>Forge!</Button>
              }
            </Col>
            <Col span={10}></Col>
          </Row>
          
        </Col>
        <Col span={12}>
          <Title level={4} style={{ color: "white", fontFamily: "futura" }}>Your Forged NFTs</Title>
          {new Array(4).fill(null).map((_, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <Button key={index}>Button</Button>
          ))}
        </Col>
      </Row>
    </>
  );
}

export default Home;
