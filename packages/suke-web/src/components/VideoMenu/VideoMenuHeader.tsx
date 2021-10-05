import { Button, Columns, Container, Heading, Icon } from "react-bulma-components"
import { Icon as IconElement } from '@iconify/react'

export const VideoMenuHeader = () => {
    return (
        <Container py="small" pt="mid"  px="big" backgroundColor="black" marginless breakpoint="fluid">
            <Columns>
                <Columns.Column>
                    <Heading size={4} textColor="white" marginless mb="smaller">
                        The Flash S4 EP2
                        <Icon ml="smaller1" size='small' style={{verticalAlign: "middle"}}>
                            <IconElement icon="bi:person-fill" color="#C74545"/>
                        
                        </Icon>
                        <span style={{fontSize: '13px', color: "#C74545", verticalAlign: "middle"}}>27</span>
                    </Heading>
                    <Heading size={6} textColor="lightgray" subtitle>
                        TV Shows
                    </Heading>
                </Columns.Column>
                <Columns.Column narrow>
                    <Button backgroundColor="blue" color="white" inverted={true} outlined={false} textWeight="semibold">
                        Open Browser
                    </Button>
                </Columns.Column>
            </Columns>
        </Container>
    )
}