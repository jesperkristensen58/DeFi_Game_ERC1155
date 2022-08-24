import { useContractReader } from "eth-hooks";
import { ethers, BigNumber } from "ethers";
import { React, useState } from "react";
import { Col, Row, Divider, Typography, Avatar, Space, Button, Card, Image, Checkbox, Skeleton, message, Modal } from "antd";
import { FireTwoTone } from '@ant-design/icons';

const { Title } = Typography;

function Home({ address, readContracts, writeContracts, tx }) {
  /*******************************************************************************************************************
  * 
  *  The main Frontend, props are passed in from the App.jsx
  * 
  *******************************************************************************************************************/
  
  const defaultCheckedList = [];

  /*******************************************************************************************************************
  * 
  *  Set State
  * 
  *******************************************************************************************************************/
  const [checkedList, setCheckedList] = useState(defaultCheckedList);
  const [loadings, setLoadings] = useState([]);  // showing components as loading
  
  // TODO: CHANGE THIS?
  const anyAddress = "0x253ac99aae5ec350cb3d0274be130052f89f6b53";
  const theForgingAddress = readContracts && readContracts.Forging ? readContracts.Forging.address : anyAddress;

  // check if we have already obtained approval from the user
  let currentApproval = useContractReader(readContracts, "Token", "isApprovedForAll(address,address)", [ethers.utils.getAddress(address ? address : anyAddress), ethers.utils.getAddress(theForgingAddress ? theForgingAddress : anyAddress)]);

  // ---- This is to toggle loading states for various components (just call loadings(<your index>) in the component):
  const enterLoading = (index) => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[index] = true;
      message.loading('executing...');
      return newLoadings;
    });
  };
  const exitLoading = (index) => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[index] = false;
      setCheckedList(defaultCheckedList);
      return newLoadings;
    });
  };
  // ----

  // the checkbox list of the raw materials
  const checkBoxGroupOnChange = (checkedValues) => {
    setCheckedList(checkedValues);
  };

  // this function will be called whenever an action requires approval (access to the user's tokens):
  const getApproval = async () => {
    if (!currentApproval) {
      message.loading('Please approve protocol access to your inventory!');

      let result = tx(writeContracts.Token.setApprovalForAll(ethers.utils.getAddress(theForgingAddress ? theForgingAddress : anyAddress), 1), update => {
        if (update && (update.status === "confirmed" || update.status === 1)) {
            message.success('Approval granted!');
            currentApproval = true;
        } else if (update && (update.status === "failed" || update.code === 4001)) {
          message.error('Access to inventory denied!');
          currentApproval = false;
          setCheckedList(defaultCheckedList);
        }
      });
      await result;
    }
  };

  // get the base url of the jsons for the items
  const baseUri = useContractReader(readContracts, "Forging", "baseUri()");

  // do a batch call to get all token balances for this user
  const myTokens = useContractReader(readContracts, "Forging", "balanceOfBatch(address[],uint256[])",
    [Array(7).fill(ethers.utils.getAddress(address ? address : anyAddress)),
    [0, 1, 2, 3, 4, 5, 6]]
  );
  const anyTokens = (myTokens && myTokens[0] !== undefined && myTokens[0] > 0) || (myTokens && myTokens[1] !== undefined && myTokens[1] > 0) || (myTokens && myTokens[2] !== undefined && myTokens[2] > 0);
  const numUnique = (myTokens && (myTokens[0] !== undefined && myTokens[0] > 0)) + (myTokens && (myTokens[1] !== undefined && myTokens[1] > 0)) + (myTokens && (myTokens[2] !== undefined && myTokens[2] > 0));

  return (
    <>
            <Button block size="medium" style={{margin: 2}} loading={loadings[10]} onClick={
                async () => {
                  enterLoading(10);
                  let result = tx(writeContracts.Token.setApprovalForAll(ethers.utils.getAddress(theForgingAddress ? theForgingAddress : anyAddress), 0), update => {
                    if (update && (update.status === "confirmed" || update.status === 1)) {
                      exitLoading(10);
                      message.success("Access successfully revoked for all items!");
                    }
                  });
                  await result;
                }}
              >
                Revoke all
              </Button>

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
                  
                {
                  myTokens && (myTokens[0] === undefined) ?
                  <>
                    <Skeleton.Button active />
                    <Skeleton active paragraph={{ rows: 1 }} />
                  </>
                :
                <>
                  <Button block size="medium" style={{margin: 2}} loading={loadings[0]} onClick={
                    async () => {
                      enterLoading(0);
                      let result = tx(writeContracts.Forging.mint(BigNumber.from("0")), update => {
                        if (update && (update.status === "confirmed" || update.status === 1)) {
                          exitLoading(0);
                        } else if (update && (update.status === "failed" || update.code === -32603 && update.data.message.includes("Cooldown"))) {
                          message.error('Action not possible while in a cooldown!');

                          exitLoading(0);
                        }
                      });
                      await result;
                    }}
                  >
                    Mint this
                  </Button>

                  <Button block size="medium" style={{margin: 2}} disabled={checkedList.length == 0} loading={loadings[3]} onClick={
                    async () => {
                      enterLoading(3);
                      await getApproval();

                      var i = 0;
                      const target = '0';
                      while (i < checkedList.length) {
                        if (checkedList[i] === target) {
                          checkedList.splice(i, 1);
                        } else {
                          ++i;
                        }
                      }

                      let convertedNumbers = checkedList.map( item => { return BigNumber.from(item) });                      
                      let result = tx(writeContracts.Forging.trade(convertedNumbers, BigNumber.from(target)), update => {
                          if (currentApproval) {
                            if (update && (update.status === "confirmed" || update.status === 1)) {
                              message.success('Success!');
                              exitLoading(3);
                            } else if (update && (update.status === "failed" || update.code === 4001)) {
                              message.error('Transaction failed!');
                              exitLoading(3);
                            }
                          }
                          if (update && (update.status === "failed" || update.code === -32603)) {
                            message.error('Please grant approval to your inventory!');
                            exitLoading(3);
                          }
                        });
                        await result;
                      
                  }}>Trade for this</Button>
                  Your Supply:  {myTokens && myTokens[0] ? myTokens[0].toNumber() : "..."}
                </>
                }
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
                {
                  myTokens && myTokens[1] === undefined ?
                  <>
                    <Skeleton.Button active />
                    <Skeleton active paragraph={{ rows: 1 }} />
                  </>
                :
                <>
                  <Button block size="medium" style={{margin: 2}} loading={loadings[1]} onClick={
                    async (e) => {
                      enterLoading(1);
                      let result = tx(writeContracts.Forging.mint(BigNumber.from("1")), update => {
                        if (update && (update.status === "confirmed" || update.status === 1)) {
                          exitLoading(1);
                        } else if (update && (update.status === "failed" || update.code === -32603 && update.data.message.includes("Cooldown"))) {
                          message.error('Action not possible while in a cooldown!');

                          exitLoading(1);
                        }
                      });
                      await result;
                    }}
                  >
                    Mint this
                  </Button>

                  <Button block size="medium" style={{margin: 2}} disabled={checkedList.length == 0} loading={loadings[4]} onClick={
                    async () => {
                      enterLoading(4);
                      await getApproval();

                      var i = 0;
                      const target = '1';
                      while (i < checkedList.length) {
                        if (checkedList[i] === target) {
                          checkedList.splice(i, 1);
                        } else {
                          ++i;
                        }
                      }

                      let convertedNumbers = checkedList.map( item => { return BigNumber.from(item) });                      
                      let result = tx(writeContracts.Forging.trade(convertedNumbers, BigNumber.from(target)), update => {
                          if (currentApproval) {
                            if (update && (update.status === "confirmed" || update.status === 1)) {
                              message.success('Success!');
                              exitLoading(4);
                            } else if (update && (update.status === "failed" || update.code === 4001)) {
                              message.error('Transaction failed!');
                              exitLoading(4);
                            }
                          }
                          if (update && (update.status === "failed" || update.code === -32603)) {
                            message.error('Please grant approval to your inventory!');
                            exitLoading(4);
                          }
                        });
                        await result;
                  }}>Trade for this</Button>

                  Your Supply:  {myTokens && myTokens[1] ? myTokens[1].toNumber() : "..."}
                </>
                }
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

              {
                  myTokens && myTokens[2] === undefined ?
                  <>
                    <Skeleton.Button active />
                    <Skeleton active paragraph={{ rows: 1 }} />
                  </>
                :
                <>
                  <Button block size="medium" style={{margin: 2}} loading={loadings[2]} onClick={
                    async (e) => {
                      enterLoading(2);
                      let result = tx(writeContracts.Forging.mint(BigNumber.from("2")), update => {
                        if (update && (update.status === "confirmed" || update.status === 1)) {
                          exitLoading(2);
                        } else if (update && (update.status === "failed" || update.code === -32603 && update.data.message.includes("Cooldown"))) {
                          message.error('Action not possible while in a cooldown!');

                          exitLoading(2);
                        }
                      });
                      await result;
                    }}
                  >
                    Mint this
                  </Button>

                  <Button block size="medium" style={{margin: 2}} disabled={checkedList.length == 0} loading={loadings[5]} onClick={
                    async () => {
                      enterLoading(5);
                      await getApproval();

                      var i = 0;
                      const target = '2';
                      while (i < checkedList.length) {
                        if (checkedList[i] === target) {
                          checkedList.splice(i, 1);
                        } else {
                          ++i;
                        }
                      }

                      let convertedNumbers = checkedList.map( item => { return BigNumber.from(item) });                      
                      let result = tx(writeContracts.Forging.trade(convertedNumbers, BigNumber.from(target)), update => {
                          if (currentApproval) {
                            if (update && (update.status === "confirmed" || update.status === 1)) {
                              message.success('Success!');
                              exitLoading(5);
                            } else if (update && (update.status === "failed" || update.code === 4001)) {
                              message.error('Transaction failed!');
                              exitLoading(5);
                            }
                          }
                          if (update && (update.status === "failed" || update.code === -32603)) {
                            message.error('Please grant approval to your inventory!');
                            exitLoading(5);
                          }
                        });
                        await result;
                  }}>Trade for this</Button>

                  Your Supply:  {myTokens && myTokens[2] ? myTokens[2].toNumber() : "..."}
                </>
                }
                
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

          { anyTokens !== undefined && anyTokens ? 
            <>
            {numUnique !== undefined && numUnique > 1 ?
                <Title level={5} style={{ color: "white", fontFamily: "futura" }}>Select two or more elements to forge weaponry</Title>
              :
              <Title level={5} style={{ color: "white", fontFamily: "futura" }}>You need two or more elements to forge weaponry</Title>
            }
            </>
          :
          <>
          { anyTokens !== undefined && anyTokens == false ?
            <>
            <Title level={4} style={{ color: "red", fontFamily: "futura" }}>You have no elements<br />Mint new elements above!</Title>
            </>
          : null
          }
          </>
          }
          
          <Checkbox.Group onChange={checkBoxGroupOnChange} value={checkedList}>
          <Row gutter={[16, 16]}>
          
          <Space>
          <Col span={8}>

            { myTokens && myTokens[0] !== undefined && myTokens[0] > 0 ?

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
                    <Checkbox value="0" style={{color: "white", fontFamily: "futura"}}>Iron {myTokens[0] !== undefined ? `(${myTokens[0].toNumber()})` : null}</Checkbox>
                  </p>
                </Row>
            </Card>

            : null }

          </Col>
          <Col span={8}>
            
          { myTokens && myTokens[1] !== undefined && myTokens[1] > 0 ?
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
                  <Checkbox value="1" style={{color: "white", fontFamily: "futura"}}>Carbon {myTokens[1] !== undefined ? `(${myTokens[1].toNumber()})` : null}</Checkbox>
                  </p>
                </Row>
            </Card>
          : null }
            
          </Col>
          <Col span={8}>

          { myTokens && myTokens[2] !== undefined && myTokens[2] > 0 ?
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
                    <Checkbox value="2" style={{color: "white", fontFamily: "futura"}}>Wood {myTokens[2] !== undefined ? `(${myTokens[2].toNumber()})` : null}</Checkbox>
                  </p>
                </Row>
            </Card>
            : null }

          </Col>
          </Space>
          </Row>
          </Checkbox.Group>

          <Row style={{margin: 12}}>
            <Col span={10}></Col>
            
            {numUnique !== undefined && numUnique > 1 ?
              <>
              {checkedList.length >= 2 ?
              <>
                <Col flex="100px">

                  <Button block size="large" shape="round" style={{margin: 2, fontFamily: "futura"}} icon={<FireTwoTone twoToneColor="#ff9a00"/>} loading={loadings[6]} onClick={
                    async () => {
                      enterLoading(6);
                      await getApproval();

                      let convertedNumbers = checkedList.map( item => { return BigNumber.from(item) });                      
                      let result = tx(writeContracts.Forging.forge(convertedNumbers), update => {
                          if (currentApproval) {
                            if (update && (update.status === "confirmed" || update.status === 1)) {
                              message.success('Success!');
                              exitLoading(6);
                            } else if (update && (update.status === "failed" || update.code === 4001)) {
                              message.error('Transaction failed!');
                              exitLoading(6);
                            }
                          }
                          if (update && (update.status === "failed" || update.code === -32603)) {
                            message.error('Please grant approval to your inventory!');
                            exitLoading(6);
                          }
                        });
                        await result;
                  }}>Forge!</Button>

                </Col>
                <Col flex="auto"></Col>
                </>
              :
              <>
              <Col flex="100px">
                {anyTokens !== undefined && anyTokens ?
                  <Button block size="large" shape="round" style={{fontFamily: "futura"}} disabled>choose elements</Button>
                : null
                }
              </Col>
              <Col flex="auto"></Col>
              </>
              }
              </>
            : null
            }
            
          </Row>
          
        </Col>
        <Col span={8}>

        <Title level={4} style={{ color: "white", fontFamily: "futura" }}>Your Forged Weaponry</Title>

          // TODO: ADD ALL TOKENS HERE [3-5] IN THE SAME WAY...
          // TODO: GET THE IPFS PATH TO IMAGES (AND CONFIRM THAT WORKS)...
          // TODO: Would be interesting with a loop here ... but that requires the tokenURI?
          // TODO: Maybe overwrite tokenURI in 1155 to just hardcode the image paths (if ipfs is slow)...
          // TODO: So yeah you would need to get the image paths of all tokens, maybe batch it?

          {/********************************
          *    TOKEN 6
          **********************************/}
          { myTokens && myTokens[6] !== undefined && myTokens[6] > 0 ?
          <Card
            hoverable
            style={{ width: 200, borderTopLeftRadius: "10px", borderTopRightRadius: "10px" }}
            bordered={true}
            bodyStyle={{ backgroundColor: "#787276" }}
            cover={<Image
              width={200}
              style={{ borderRadius: "10px" }}
              src="https://images.squarespace-cdn.com/content/v1/571079941bbee00fd7f0470f/1534799119980-PRY9DCBYV547AHYIOBSH/Iron+%284%29.JPG?format=2500w"
              // src={useContractReader(readContracts, "Token", "uri(uint256)", [6])}
              preview={{
                src: 'https://images.squarespace-cdn.com/content/v1/571079941bbee00fd7f0470f/1534799119980-PRY9DCBYV547AHYIOBSH/Iron+%284%29.JPG?format=2500w',
              }}
            />}
          >
            
              <Button size="medium" loading={loadings[8]} onClick={
                    async () => {
                      enterLoading(8);
                      await getApproval();
                      let result = tx(writeContracts.Forging.burn(6), update => {
                          if (currentApproval) {
                            if (update && (update.status === "confirmed" || update.status === 1)) {
                              message.success('Success!');
                              exitLoading(8);
                            } else if (update && (update.status === "failed" || update.code === 4001)) {
                              message.error('Transaction failed!');
                              exitLoading(8);
                            } 
                          }
                          if (update && (update.status === "failed" || update.code === -32603)) {
                            message.error('Please grant approval to your inventory!');
                            exitLoading(8);
                          }
                        });
                        await result; 
                  }}
                >
                  Burn ({BigNumber.from(myTokens[6]).toNumber()})
                </Button>
              
          </Card>
          : null 
          }
        </Col>
      </Row>
    </>
  );
}

export default Home;
