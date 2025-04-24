import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {Colors, FontsFamilys, FontSize, ImageUrl, Texts} from '../../constant';
import OpacityButton from '../../components/OpacityButton';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {ROUTE_NAMES} from '../../navigation/StackNavigation';
import Header from '../../components/Header';
import {moderateScale} from '../../utils/responsive';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Category, SubCategory} from '../../Api/helper';
import { useDispatch } from 'react-redux';
import { setCategeroies } from '../../Redux/cookiesReducer';

type HobbyScreenRouteParams = {
  isEditMode?: boolean;
};

type HobbyScreenRouteProp = RouteProp<
  {HobbyScreen: HobbyScreenRouteParams},
  'HobbyScreen'
>;

const HobbyScreen = ({route}) => {
  const {param} = route.params;

  const navigation = useNavigation();
  // const route = useRoute<HobbyScreenRouteProp>();
  const [selectedTags, setSelectedTags] = useState<any>([]);
  const isEditMode = route.params?.isEditMode || false;
  const [categoryList, setCategoryList] = useState<any[]>([]);
  const [subCategoriesMap, setSubCategoriesMap] = useState<{
    [key: string]: string[];
  }>({});
  const dispatch= useDispatch()
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const categoryRes = await Category();
          console.log(categoryRes,"categoryRes========>")
        const categories = categoryRes?.data?.data?.response || [];
        setCategoryList(categories);

        const subCategoryPromises = categories.map(async category => {
          const res = await SubCategory(category._id);
          
          const subData = res?.data?.data;
          console.log(subData,"subCategoryPromises==============>")
          const subTitles = Array.isArray(subData) ? subData.map(({ _id, title }) => ({ _id, title })) : [];
            
          console.log(subTitles,"subTitles=======>")
          return {
            categoryId: category._id,
            subCategories: subTitles,
          };
        });

        const subCategoryResults = await Promise.all(subCategoryPromises);

        const map: {[key: string]: string[]} = {};

        console.log(
          subCategoryResults,
          'subCategoryResultssubCategoryResults===>>',
        );

        subCategoryResults.forEach(({categoryId, subCategories}) => {
          console.log(categoryId,'categoryIdcategoryId===>',subCategories);
          
          map[categoryId] = subCategories;
        });

        console.log('Final subCategoriesMap:', map);
        setSubCategoriesMap(map);
      } catch (error) {
        console.error('Error fetching categories or subcategories:', error);
      }
      setIsLoading(false);
    };

    fetchCategoryData();
  }, []);

  // const handleTagPress = (tag: string, id: any) => {
  //   console.log(id,'>>>>>>>>>======',tag);
    
  //   if (selectedTags.includes(tag?._id)) {
  //     setSelectedTags(prev => prev.filter(t => t !== tag?._id));
  //   } else {
  //     setSelectedTags(prev => [
  //       ...prev,
  //       {category_Id: id, Sub_Category_Id: tag?._id},
  //     ]);
  //   }
  // };
  const handleTagPress = (tag: any, categoryId: string) => {
    console.log(categoryId, '>>>>>>>>>======', tag);
  
    setSelectedTags(prevSelected => {
      // Check if category already exists
      const existingCategoryIndex = prevSelected.findIndex(item => item.category_Id === categoryId);
  
      if (existingCategoryIndex > -1) {
        const updated = [...prevSelected];
        const subCategoryArray = updated[existingCategoryIndex].Sub_Category_Id;
  
        if (subCategoryArray.includes(tag._id)) {
          // Remove subcategory
          updated[existingCategoryIndex].Sub_Category_Id = subCategoryArray.filter(id => id !== tag._id);
  
          // Remove the category if no subcategories are left
          if (updated[existingCategoryIndex].Sub_Category_Id.length === 0) {
            updated.splice(existingCategoryIndex, 1);
          }
  
          return updated;
        } else {
          // Add new subcategory
          updated[existingCategoryIndex].Sub_Category_Id.push(tag._id);
          return updated;
        }
      } else {
        // Add new category with the subcategory
        return [
          ...prevSelected,
          { category_Id: categoryId, Sub_Category_Id: [tag._id] }
        ];
      }
    });
  };
  

  console.log(selectedTags, 'selectedTags========>');

  const renderTags = (setSubCategoryList: any, id:any, isSelection = true) => {
    return (
      <View style={styles.tagContainer}>
        {setSubCategoryList?.map(tag => {
           console.log(tag,'tag========>')
          const isSelected = selectedTags.some(item =>
            item?.Sub_Category_Id.includes(tag?._id)
          );
         
          const isSelectedTag = isSelection && isSelected;
          const baseStyle = isSelection
            ? [styles.tag, isSelectedTag && styles.tagSelected]
            : [styles.tag, styles.tagSelected];
          const textStyle = isSelection
            ? [styles.tagText, isSelectedTag && styles.tagTextSelected]
            : [styles.tagText, styles.tagTextSelected];

          return (
            <TouchableOpacity
              key={tag}
              style={baseStyle}
              onPress={() => handleTagPress(tag, id)}
              activeOpacity={0.7}>
              <Text style={textStyle}>{tag?.title}</Text>
              {isSelectedTag || !isSelection ? (
                <Text style={styles.tagClose}>✕</Text>
              ) : null}
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const saveHobbiesToStorage = async () => {
    try {
      const userDetails = await AsyncStorage.getItem('userDetails');
      const parsedDetails = userDetails ? JSON.parse(userDetails) : {};

      const selectedWithCategory: {categoryId: string; subcategory: string}[] =
        [];

      // Map selected subcategories to their categoryId
      for (const [categoryId, subcategories] of Object.entries(
        subCategoriesMap,
      )) {
        subcategories.forEach(sub => {
          if (selectedTags.includes(sub)) {
            selectedWithCategory.push({
              categoryId,
              subcategory: sub,
            });
          }
        });
      }

      parsedDetails.hobbies = selectedWithCategory;

     
      dispatch(setCategeroies(selectedTags))
      

      await AsyncStorage.setItem('userDetails', JSON.stringify(parsedDetails));
      navigation.navigate(ROUTE_NAMES.BioScreen, {
        param,
      });
    } catch (error) {
      console.error('Failed to save hobbies:', error);
    }
  };

  return (
    <LinearGradient
      colors={['#FEB413', '#F9F9F9']}
      locations={[0, 0.85]}
      style={styles.container}>
      <StatusBar backgroundColor="#FEB413" />
      <Header
        leftIcon={ImageUrl.BackIcon}
        onPressLeftImg={() => navigation.goBack()}
        containerstyle={{
          marginTop: isEditMode ? moderateScale(35) : moderateScale(48),
        }}
        centerText={isEditMode ? 'Edit Interest' : undefined}
      />

      <View style={styles.contentContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.scrollView}>
          {!isEditMode && (
            <>
              <Text style={styles.title}>What are you into?</Text>
              <Text style={styles.subTitle}>{Texts.Everyne_Know}</Text>
            </>
          )}

          {/* Selected Tags */}
          {/* {selectedTags.length > 0 && (
            <View style={styles.selectedTagsContainer}>
              {renderTags(selectedTags)}
              <View style={styles.divider} />
            </View>
          )} */}

          {/* Tag Categories */}
          {categoryList?.length > 0 && (
            <View
              style={[
                styles.categoriesContainer,
                isEditMode && {marginTop: moderateScale(35)},
              ]}>
              {categoryList.map(category => {
                 console.log(subCategoriesMap,"subCategoriesMap========>")
                const subCategoryTitles = subCategoriesMap[category._id] || [];
                console.log(subCategoryTitles, 'kjnjklnkljnkjlnlkjnk======>');
                return (
                  <View key={category._id}>
                    <Text style={styles.categoryTitle}>{category.title}</Text>
                    {renderTags(subCategoryTitles, category?._id)}
                  </View>
                );
              })}
            </View>
          )}
        </ScrollView>

        {!isLoading && (
          <View style={styles.bottomButton}>
            <OpacityButton name="Next" pressButton={saveHobbiesToStorage} />
          </View>
        )}
      </View>
    </LinearGradient>
  );
};

export default HobbyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  title: {
    fontSize: FontSize.T_four,
    fontFamily: FontsFamilys.Poppins_SemiBold,
    textAlign: 'center',
    marginTop: moderateScale(40),
    color: Colors.Main_Black,
  },
  subTitle: {
    fontSize: FontSize.fourteen,
    fontFamily: FontsFamilys.Poppins_Medium,
    marginVertical: moderateScale(10),
    color: 'black',
    width: '85%',
    alignSelf: 'center',
    textAlign: 'center',
  },
  categoryTitle: {
    fontSize: FontSize.fourteen,
    fontFamily: FontsFamilys.Poppins_SemiBold,
    marginBottom: moderateScale(8),
    color: 'black',
    marginHorizontal: moderateScale(24),
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: moderateScale(4),
    marginBottom: moderateScale(8),
    marginHorizontal: moderateScale(24),
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F6EE',
    borderRadius: moderateScale(30),
    paddingHorizontal: moderateScale(14),
    paddingVertical: moderateScale(6),
    marginRight: moderateScale(8),
    marginBottom: moderateScale(8),
  },
  tagSelected: {
    backgroundColor: '#367a4c',
  },
  tagText: {
    fontFamily: FontsFamilys.Poppins_Medium,
    fontSize: FontSize.twelve,
    color: '#367a4c',
  },
  tagTextSelected: {
    color: 'white',
  },
  tagClose: {
    marginLeft: 6,
    color: 'white',
    fontSize: FontSize.twelve,
    fontFamily: FontsFamilys.Poppins_Medium,
  },
  selectedTagsContainer: {
    marginTop: moderateScale(20),
    marginHorizontal: moderateScale(2),
  },
  divider: {
    height: 1,
    backgroundColor: '#E6E6E6',
    marginBottom: moderateScale(20),
    width: '88%',
    alignSelf: 'center',
  },
  bottomButton: {
    paddingBottom: moderateScale(60),
    width: '85%',
    alignSelf: 'center',
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  categoriesContainer: {
    marginBottom: moderateScale(20),
  },
});
