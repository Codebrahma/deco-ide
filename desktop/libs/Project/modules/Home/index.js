import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet
} from 'react-native'
import { connect } from 'react-redux'
import { changeBackground } from './actions'

class Home extends Component {

  static navigationOptions = {
    title: 'Home',
  };

  render(){
  
    const { backgroundColor } = this.props.home

    return(
      <View 
        style={[
          styles.container, 
          { backgroundColor }
        ]}
      >
        <Text style={styles.header}>
          Welcome to Edge IDE
        </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  header: {
    fontSize: 30
  }
})

const mapStateToProps = (state) => ({
  home: state.home
})

const mapDispatchToProps = (dispatch) => ({
  changeBackground: (color) => { dispatch(changeBackground(color)) }
})

export default connect(mapStateToProps, mapDispatchToProps)(Home)