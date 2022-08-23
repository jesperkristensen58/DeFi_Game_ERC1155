import { useContractReader } from "eth-hooks";
import { ethers } from "ethers";
import React from "react";
import { Link } from "react-router-dom";
import { Col, Row, Divider, Typography, Avatar, Space, Button, Card, Image } from "antd";
import { UserOutlined } from '@ant-design/icons';

const ButtonGroup = Button.Group;
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
  const purpose = useContractReader(readContracts, "YourContract", "purpose");

  return (
    <>
      <Row style={{margin: 12}}>
        <Col span={8}>
          
        <Space direction="vertical" size="middle" align="center">
          <Card
            hoverable
            bordered={false}
            style={{ width: 300 }}
            cover={<Image
              width={300}
              src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png?x-oss-process=image/blur,r_50,s_50/quality,q_1/resize,m_mfit,h_200,w_200"
              preview={{
                src: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
              }}
            />}
          >
            <Row>
                <p>
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
            hoverable
            bordered={false}
            style={{ width: 300 }}
            cover={<Image
              width={300}
              src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png?x-oss-process=image/blur,r_50,s_50/quality,q_1/resize,m_mfit,h_200,w_200"
              preview={{
                src: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
              }}
            />}
          >
            <Row>
                <p>
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
            bordered={false}
            style={{ width: 300 }}
            cover={<Image
              width={300}
              src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png?x-oss-process=image/blur,r_50,s_50/quality,q_1/resize,m_mfit,h_200,w_200"
              preview={{
                src: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
              }}
            />}
          >
            <Row>
                <p>
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
      <Row>
        <Col span={12}>
          <Title level={4}>Your NFTs</Title>

          <Title level={5}>Select two or more to forge!</Title>
        </Col>
        <Col span={12}>
          <Title level={4}>Your Forged NFTs</Title>
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
