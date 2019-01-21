import React, { Component } from 'react'
import { View, ScrollView, Text, Alert } from 'react-native'
import { Button, TextBlock, MainDetails, Heroimage, CardSection } from '../../components'
import { sendProductEnquiryEmail } from '../../redux/actions/SubmitActions'
import { Actions } from 'react-native-router-flux'
import HTML from 'react-native-render-html'
import Images from '@assets/images'

// i've used reusable component for Heroimage, MainDetails, CardSection

const ProductPage = ({ product }) =>  {
  // product is an object which is called props for the page
  console.log(product);

  // Getting all styles from styles const
  const { itemdetail, paragraph, NewsBox, headerTextStyle } = styles

  return (

    <ScrollView>
      <Heroimage
        image={{uri:product.images[0].src}}
      />
      <MainDetails
        title={product.name}
        smalltitle={product.origin}
        shortdesc={product.short_description}
        Price={product.price}
        Date={product.date}
      />
      <View style={NewsBox}>
        {/*<HTML*/}
          {/*baseFontStyle={styles.paragraph}*/}
          {/*html={product.origin}*/}
          {/*ignoredStyles={['display']}*/}
        {/*/>*/}
        <HTML
          baseFontStyle={styles.paragraph}
          html={product.description}
          ignoredStyles={['display']}
        />
      </View>
      <CardSection>
        <Button
          title='ENQUIRE'
          onPress={() => {
            sendProductEnquiryEmail(product)
              .then(() => {
                Alert.alert('Success', 'Your enquiry has been sent to Meatex.')
              })
              .catch(err => {
                Alert.alert('Oops!', 'Something went wrong sending email')
              })
          }}
        />
      </CardSection>
    </ScrollView>
  )
}

const styles = {
  paragraph: {
    color: '#838588',
    fontSize: 12,
    padding:15,
    marginTop:40,
    position:'relative'
  },
  itemdetail:{
    backgroundColor:'white'
  },
  NewsBox:{
    backgroundColor:'#FFF',
    padding: 8
  },
  headerTextStyle: {
    fontSize:14,
    fontWeight: 'bold',
    color:'#3f6d95',
  }
}

export default ProductPage
