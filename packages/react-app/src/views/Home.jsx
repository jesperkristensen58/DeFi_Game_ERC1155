import { useContractReader } from "eth-hooks";
import { ethers } from "ethers";
import { React, useState} from "react";
import { Link } from "react-router-dom";
import { Col, Row, Divider, Typography, Avatar, Space, Button, Card, Image, Checkbox } from "antd";
import { FireTwoTone, PlusCircleOutlined } from '@ant-design/icons';

const defaultCheckedList = [];

const { Title } = Typography;

/**
 * web3 props can be passed from '../App.jsx' into your local view component for use
 * @param {*} yourLocalBalance balance on current network
 * @param {*} readContracts contracts from current chain already pre-loaded using ethers contract module. More here https://docs.ethers.io/v5/api/contract/contract/
 * @returns react component
 **/
function Home({ readContracts, writeContracts, tx }) {


  /*******************************************************************************************************************
  * 
  *  Set State
  * 
  *******************************************************************************************************************/
  const [checkedList, setCheckedList] = useState(defaultCheckedList);

  // Read the contract
  const theOwner = useContractReader(readContracts, "Forging", "owner()")
  const theBalance = useContractReader(readContracts, "Forging", "balanceOf(address,uint256)", ["0x95E2A897E609bCc36dF377EEEF4163bF8fBfcceA", 0]);

  console.log("OWNER");
  console.log(theOwner);
  console.log(theBalance);
  console.log("DONE")

  // Write to the contract
  return (
    <>
    <Button
    style={{ marginTop: 8 }}
    onClick={async () => {
      /* look how you call setPurpose on your contract: */
      /* notice how you pass a call back for tx updates too */
      const result = tx(writeContracts.Forging.mint(0), update => {
        console.log("📡 Transaction Update:", update);
        if (update && (update.status === "confirmed" || update.status === 1)) {
          console.log(" 🍾 Transaction " + update.hash + " finished!");
          console.log(
            " ⛽️ " +
              update.gasUsed +
              "/" +
              (update.gasLimit || update.gas) +
              " @ " +
              parseFloat(update.gasPrice) / 1000000000 +
              " gwei",
          );
        }
      });
      console.log("awaiting metamask/web3 confirm result...", result);
      console.log(await result);
    }}
  >
    Mint!
  </Button>
    </>
  );



  const showthecard = true; // these variables would come from the contract... do we own any wood etc.?
  

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
          
          <Title level={4} style={{ color: "white", fontFamily: "futura" }}>Your Elements</Title>
          <Title level={5} style={{ color: "white", fontFamily: "futura" }}>Select two or more elements to forge weaponry</Title>
          
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
                    <Checkbox value="0" style={{color: "white", fontFamily: "futura"}}>Iron</Checkbox>
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
                  <Checkbox value="1" style={{color: "white", fontFamily: "futura"}}>Carbon</Checkbox>
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
                    <Checkbox value="2" style={{color: "white", fontFamily: "futura"}}>Wood</Checkbox>
                  </p>
                </Row>
            </Card>

          </Col>
          </Space>
          </Row>
          </Checkbox.Group>

          <Row style={{margin: 12}}>
            <Col span={10}></Col>
            
              {checkedList.length >= 2 ?
              <>
                <Col flex="100px">
                  <Button block size="large" shape="round" style={{fontFamily: "futura"}} icon={<FireTwoTone twoToneColor="#ff9a00" />}>Forge!</Button>
                </Col>
                <Col flex="auto"></Col>
                </>
              :
              <>
              <Col flex="100px">
                <Button block size="large" shape="round" style={{fontFamily: "futura"}} disabled>choose elements</Button>
              </Col>
              <Col flex="auto"></Col>
              </>
              }
            
            
          </Row>
          
        </Col>
        <Col span={12}>
          <Title level={4} style={{ color: "white", fontFamily: "futura" }}>Your Forged Weaponry</Title>
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
