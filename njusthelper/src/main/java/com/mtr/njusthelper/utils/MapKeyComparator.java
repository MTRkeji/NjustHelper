package com.mtr.njusthelper.utils;
import java.util.Comparator;

//比较器
public class MapKeyComparator implements Comparator<String> {
    @Override
    public int compare(String o1, String o2) {
        return o2.compareTo(o1);
    }
}
