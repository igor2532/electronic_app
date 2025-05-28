import { Skeleton } from "@motify/skeleton";
import { View } from "react-native";


export default function ProductsSkeleton({ num = 6, ITEM_WIDTH = 160, ITEM_MARGIN = 12 }) {
  // 2 в ряд: num = 6, будет 3 строки по 2 плитки
  const rows = Math.ceil(num / 2);
  let counter = 0;
  return (
    <View style={{ paddingHorizontal: ITEM_MARGIN, marginTop:50 }}>
      {Array(rows).fill().map((_, rowIdx) => (
        <View key={rowIdx} style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: ITEM_MARGIN,
        }}>
          {[0, 1].map(col => {
            counter++;
            if (counter > num) return <View key={col} style={{ width: ITEM_WIDTH }} />;
            return (
              <View
                key={col}
                style={{
                  width: ITEM_WIDTH,
                  borderRadius: 16,
                  backgroundColor: 'transparent',
                  overflow: 'hidden',
                }}>
                <Skeleton show width={ITEM_WIDTH} height={120} radius={14}  color="#dadbe3" />
                <Skeleton show width={ITEM_WIDTH * 0.8} height={15} radius={5} color="#dadbe3" style={{ marginTop: 8, marginBottom: 4 }} />
                <Skeleton show width={ITEM_WIDTH * 0.6} height={15} radius={5} color="#dadbe3" />
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
}